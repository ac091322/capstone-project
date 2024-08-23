from app.models import db, environment, SCHEMA, Game
from sqlalchemy.sql import text
from datetime import datetime


def seed_games():
    black_myth_wukong = Game(
        title="Black Myth Wukong",
        user_id=1,
        price="59.99",
        release_date=datetime(2024, 8, 19).date(),
        description="Black Myth: Wukong is an action RPG rooted in Chinese mythology. The story is based on Journey to the West, one of the Four Great Classical Novels of Chinese literature. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.",
        min_requirements="Requires a 64-bit processor and operating system",
        min_os="Windows 10 64-bit",
        min_processor="Intel Core i5-8400 / AMD Ryzen 5 1600",
        min_memory="16 GB RAM",
        min_graphics="NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB",
        min_directx="Version 11",
        min_storage="130 GB available space",
        min_sound_card="Windows Compatible Audio Device",
        min_additional_notes="HDD Supported, SSD Recommended. The above specifications were tested with DLSS/FSR/XeSS enabled.",
        rec_requirements="Requires a 64-bit processor and operating system",
        rec_os="Windows 10 64-bit",
        rec_processor="Intel Core i7-9700 / AMD Ryzen 5 5500",
        rec_memory="16 GB RAM",
        rec_graphics="NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT / INTEL Arc A750",
        rec_directx="Version 12",
        rec_storage="130 GB available space",
        rec_sound_card="Windows Compatible Audio Device",
        rec_additional_notes="SSD Required. The above specifications were tested with DLSS/FSR/XeSS enabled.",
    )

    db.session.add_all([black_myth_wukong])
    db.session.commit()


def undo_games():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM games"))

    db.session.commit()
