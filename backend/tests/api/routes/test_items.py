import uuid
from typing import Any

from fastapi.testclient import TestClient
from sqlmodel import Session

from app import crud
from app.core.config import settings
from app.models import Item, ItemCreate, ItemPriority
from tests.utils.item import create_random_item
from tests.utils.user import create_random_user
from tests.utils.utils import random_lower_string


def create_priority_item(
    db: Session, owner_id: uuid.UUID, priority: ItemPriority
) -> Item:
    item_in = ItemCreate(
        title=random_lower_string(),
        description=random_lower_string(),
        priority=priority,
    )
    return crud.create_item(session=db, item_in=item_in, owner_id=owner_id)


def assert_invalid_priority_response(response: Any) -> None:
    assert response.status_code == 422
    body = response.text.lower()
    assert "priority" in body
    assert "low" in body
    assert "medium" in body
    assert "high" in body
    for forbidden in ("select", "insert", "psycopg", "sqlalchemy", "traceback"):
        assert forbidden not in body


def test_create_item(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "owner_id" in content


def test_create_item_default_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Default priority", "description": "No priority sent"}
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    assert response.json()["priority"] == "medium"


def test_create_item_with_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "title": "High priority",
        "description": "Sent explicitly",
        "priority": "high",
    }
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["priority"] == "high"


def test_create_item_invalid_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {
        "title": "Invalid priority",
        "description": "Unknown value",
        "priority": "urgent",
    }
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert_invalid_priority_response(response)


def test_read_item(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == item.title
    assert content["description"] == item.description
    assert content["id"] == str(item.id)
    assert content["owner_id"] == str(item.owner_id)
    assert content["priority"] == "medium"


def test_read_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/items/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


def test_read_item_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_read_items(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_random_item(db)
    create_random_item(db)
    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2
    assert all(
        item["priority"] in ("low", "medium", "high") for item in content["data"]
    )


def test_read_items_without_priority_filter_is_unchanged(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    high_item = create_priority_item(db, create_random_user(db).id, ItemPriority.high)
    low_item = create_priority_item(db, create_random_user(db).id, ItemPriority.low)
    response = client.get(
        f"{settings.API_V1_STR}/items/?limit=1000",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    ids = {item["id"] for item in content["data"]}
    assert str(high_item.id) in ids
    assert str(low_item.id) in ids
    assert content["count"] == len(content["data"])


def test_read_items_filter_by_priority_superuser(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    owner_a = create_random_user(db)
    owner_b = create_random_user(db)
    high_from_a = create_priority_item(db, owner_a.id, ItemPriority.high)
    high_from_b = create_priority_item(db, owner_b.id, ItemPriority.high)
    low_from_b = create_priority_item(db, owner_b.id, ItemPriority.low)

    response = client.get(
        f"{settings.API_V1_STR}/items/?priority=high&limit=1000",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    ids = {item["id"] for item in content["data"]}
    assert str(high_from_a.id) in ids
    assert str(high_from_b.id) in ids
    assert str(low_from_b.id) not in ids
    assert all(item["priority"] == "high" for item in content["data"])
    assert content["count"] == len(content["data"])


def test_read_items_filter_by_priority_normal_user(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    user = crud.get_user_by_email(session=db, email=settings.EMAIL_TEST_USER)
    assert user is not None
    other_user = create_random_user(db)
    own_high = create_priority_item(db, user.id, ItemPriority.high)
    own_low = create_priority_item(db, user.id, ItemPriority.low)
    other_high = create_priority_item(db, other_user.id, ItemPriority.high)

    response = client.get(
        f"{settings.API_V1_STR}/items/?priority=high&limit=1000",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    ids = {item["id"] for item in content["data"]}
    assert str(own_high.id) in ids
    assert str(own_low.id) not in ids
    assert str(other_high.id) not in ids
    assert all(item["priority"] == "high" for item in content["data"])
    assert all(item["owner_id"] == str(user.id) for item in content["data"])
    assert content["count"] == len(content["data"])


def test_read_items_invalid_priority_value(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"priority": "urgent"},
    )
    assert_invalid_priority_response(response)


def test_read_items_priority_filter_rejects_sql_injection(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    create_priority_item(db, create_random_user(db).id, ItemPriority.high)
    unfiltered = client.get(
        f"{settings.API_V1_STR}/items/?limit=1000",
        headers=superuser_token_headers,
    )
    assert unfiltered.status_code == 200

    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"priority": "high' OR 1=1--"},
    )
    assert_invalid_priority_response(response)
    content = response.json()
    assert "data" not in content
    assert len(content["detail"]) >= 1


def test_update_item(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["id"] == str(item.id)
    assert content["owner_id"] == str(item.owner_id)
    assert content["priority"] == "medium"


def test_update_item_with_priority(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json={"priority": "low"},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["priority"] == "low"
    assert content["title"] == item.title


def test_update_item_without_priority_keeps_stored_value(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    first_response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json={"priority": "high"},
    )
    assert first_response.status_code == 200
    assert first_response.json()["priority"] == "high"

    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json={"title": "Updated title"},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == "Updated title"
    assert content["priority"] == "high"


def test_update_item_invalid_priority(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
        json={"priority": "urgent"},
    )
    assert_invalid_priority_response(response)


def test_update_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{uuid.uuid4()}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


def test_update_item_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"


def test_delete_item(
    client: TestClient, superuser_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.delete(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Item deleted successfully"


def test_delete_item_not_found(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/items/{uuid.uuid4()}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Item not found"


def test_delete_item_not_enough_permissions(
    client: TestClient, normal_user_token_headers: dict[str, str], db: Session
) -> None:
    item = create_random_item(db)
    response = client.delete(
        f"{settings.API_V1_STR}/items/{item.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    content = response.json()
    assert content["detail"] == "Not enough permissions"
