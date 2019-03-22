# Using Model classes to add data to tables
import logging

from flask import Flask

from app import create_app
from models.theme import Theme, SubTheme
from models.unit import Unit

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


def create_application() -> Flask:
    """
    Create Flask App
    :return: Flask App
    """
    return create_app()


def create_unit(symbol: str = 'kg', description: str = 'Kilogram') -> None:
    """
    Create Unit
    :param symbol: Units symbol
    :param description: Units description
    :raises ValueError: If the new Unit is not persisted to the dB
    """
    unit = Unit.get_by_symbol(symbol)
    if not unit:
        unit = Unit(symbol, description)
        unit.save()
        unit.commit()

    if not unit:
        logger.critical('ValueError raised while creating Unit')
        raise ValueError


def create_theme(name: str = 'Environment') -> Theme:
    """
    Create a Theme
    :param name: Themes name
    :raises ValueError: If the new Theme is not persisted to the dB
    :return: A new Theme
    """
    theme = Theme.get_by_name(name)
    if not theme:
        theme = Theme(name)
        theme.save()
        theme.commit()
    if not theme:
        logger.critical('ValueError raised while creating Theme')
        raise ValueError
    return theme


def create_sub_theme(theme: Theme, name: str = 'Airquality') -> None:
    """
    Create a SubTheme
    :param theme: Parent Theme
    :param name: SubThemes name
    :raises ValueError: If the new SubTheme is not persisted to the dB
    """
    sub_theme = SubTheme.get_by_name(name)
    if not sub_theme:
        sub_theme = SubTheme(theme.id, name)
        sub_theme.save()
        sub_theme.commit()
    if not sub_theme:
        logger.critical('ValueError raised while creating SubTheme')
        raise ValueError


def create_minimal_db_entries():
    """
    Create minimal entries in the dB for the importers to execute succesfully
    :raises ValueError: If any dependencies are not created succesfully
    """
    try:
        app = create_application()
        create_unit()
        theme = create_theme()
        create_sub_theme(theme)
    except ValueError:
        logger.critical('ValueError raised while making dB entries for units, themes, sub-themes')


if __name__ == '__main__':
    create_minimal_db_entries()
