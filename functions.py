"""
This module for define various command to this bot
"""

def get_help(admin=False):
    """For help command when the bot is being summoned on group chat"""
    if admin is True:
        return "\nDaftar command:" \
               "\n/help" \
               "\n/jadwal hari ini" \
               "\n/jadwal besok" \
               "\n/jadwal klub" \
               "\n/fact" \
               "\n/mcstatus" \
               "\n/mcplayers"
    return "\nDaftar command:" \
           "\n/solve: Mencari solusi persamaan kuadrat, contoh input:" \
           "\n/solve x^2 - y^2 + 1 = 0"
