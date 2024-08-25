from flask_wtf import FlaskForm
from wtforms import StringField, EmailField
from wtforms.validators import DataRequired, Email, ValidationError, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError("Email address is already in use.")


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError("Username is already in use.")


class SignUpForm(FlaskForm):
    username = StringField(
        "Username", validators=[DataRequired(), username_exists, Length(min=2, max=60)]
    )
    email = EmailField(
        "Email",
        validators=[DataRequired(), Email(), user_exists, Length(min=5, max=60)],
    )
    password = StringField("password", validators=[DataRequired()])
