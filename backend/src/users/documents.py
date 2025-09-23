from beanie import Document


class UsersDocument(Document):
    username: str
    password: str
    permissions: str
    class Settings:
        name = "users"