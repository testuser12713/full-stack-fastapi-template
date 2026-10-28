import uuid

from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from tests.utils.item import create_random_item
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import random_email, random_lower_string


def _create_item(
    client: TestClient,
    headers: dict[str, str],
    *,
    title: str,
    description: str | None = None,
    priority: str | None = None,
) -> dict[str, object]:
    payload: dict[str, object] = {"title": title}
    if description is not None:
        payload["description"] = description
    if priority is not None:
        payload["priority"] = priority
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=headers,
        json=payload,
    )
    assert response.status_code == 201
    return response.json()


def test_create_item(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 201
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "owner_id" in content


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


def test_create_item_defaults_to_medium_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    content = _create_item(client, superuser_token_headers, title=random_lower_string())
    assert content["priority"] == "medium"

    response = client.get(
        f"{settings.API_V1_STR}/items/{content['id']}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    assert response.json()["priority"] == "medium"


def test_create_item_with_explicit_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    content = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="high"
    )
    assert content["priority"] == "high"

    response = client.get(
        f"{settings.API_V1_STR}/items/{content['id']}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    assert response.json()["priority"] == "high"


def test_update_item_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    item = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="medium"
    )
    response = client.put(
        f"{settings.API_V1_STR}/items/{item['id']}",
        headers=superuser_token_headers,
        json={"priority": "low"},
    )
    assert response.status_code == 200
    assert response.json()["priority"] == "low"


def test_update_item_without_priority_keeps_existing(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    item = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="high"
    )
    response = client.put(
        f"{settings.API_V1_STR}/items/{item['id']}",
        headers=superuser_token_headers,
        json={"title": "Updated title"},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == "Updated title"
    assert content["priority"] == "high"


def test_create_item_invalid_priority(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    title = random_lower_string()
    response = client.post(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        json={"title": title, "priority": "urgent"},
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "priority"

    list_response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"limit": 1000},
    )
    assert list_response.status_code == 200
    assert all(item["title"] != title for item in list_response.json()["data"])


def test_update_item_invalid_priority_keeps_item_unchanged(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    item = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="high"
    )
    response = client.put(
        f"{settings.API_V1_STR}/items/{item['id']}",
        headers=superuser_token_headers,
        json={"priority": "urgent"},
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "priority"

    read_response = client.get(
        f"{settings.API_V1_STR}/items/{item['id']}",
        headers=superuser_token_headers,
    )
    assert read_response.status_code == 200
    assert read_response.json()["priority"] == "high"


def test_read_items_filter_by_priority_superuser(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    high_item = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="high"
    )
    low_item = _create_item(
        client, superuser_token_headers, title=random_lower_string(), priority="low"
    )

    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"priority": "high", "limit": 1000},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["count"] == len(content["data"])
    assert all(item["priority"] == "high" for item in content["data"])
    item_ids = {item["id"] for item in content["data"]}
    assert high_item["id"] in item_ids
    assert low_item["id"] not in item_ids

    all_response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"limit": 1000},
    )
    assert all_response.status_code == 200
    assert low_item["id"] in {item["id"] for item in all_response.json()["data"]}


def test_read_items_filter_by_priority_normal_user(
    client: TestClient, db: Session
) -> None:
    headers = authentication_token_from_email(
        client=client, email=random_email(), db=db
    )
    high_one = _create_item(
        client, headers, title=random_lower_string(), priority="high"
    )
    high_two = _create_item(
        client, headers, title=random_lower_string(), priority="high"
    )
    low_item = _create_item(
        client, headers, title=random_lower_string(), priority="low"
    )

    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=headers,
        params={"priority": "high"},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["count"] == 2
    assert len(content["data"]) == 2
    assert {item["id"] for item in content["data"]} == {
        high_one["id"],
        high_two["id"],
    }
    assert all(item["priority"] == "high" for item in content["data"])
    assert low_item["id"] not in {item["id"] for item in content["data"]}

    all_response = client.get(f"{settings.API_V1_STR}/items/", headers=headers)
    assert all_response.status_code == 200
    assert all_response.json()["count"] == 3


def test_read_items_invalid_priority_filter(
    client: TestClient, superuser_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/items/",
        headers=superuser_token_headers,
        params={"priority": "high' OR 1=1--"},
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "priority"
