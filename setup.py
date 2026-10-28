from setuptools import setup

setup(
    name="fastapi-full-stack-template",
    version="0.1.0",
    description="Full stack FastAPI template with a React frontend",
    packages=[],
    install_requires=["app @ file:./backend"],
    python_requires=">=3.13,<4.0",
)
