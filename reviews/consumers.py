
from channels import Group


def ws_connect(message):
    Group('scores').add(message.reply_channel)
    message.reply_channel.send({
        "text": "connected",
    })

def ws_disconnect(message):
    Group('scores').discard(message.reply_channel)
