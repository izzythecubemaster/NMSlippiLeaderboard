import os

raw_player_code_directory = os.listdir()
raw_player_code_files = []
for file in raw_player_code_directory:
    if file.startswith("raw_player_codes_") and file.endswith(".csv"):
        raw_player_code_files.append(file)

def filter_code(code):
    [name, code] = code.replace(' ','#').split('#')
    return f'{name.upper()}#{code}'

player_codes = {}
if len(raw_player_code_files) > 0:
    raw_code_file = open(raw_player_code_files[0])
    for code in raw_code_file:
        if (code.startswith('Timestamp')):
            continue
        name = code.replace('\n','').split(',')[2]
        final_code = filter_code(code.replace('\n','').split(',')[1])
        if name == "":
            continue
        if final_code in player_codes:
            continue
        else:
            player_codes[final_code] = name

array_string = ""
for code in player_codes:
    array_string += f'  "{code}": "{player_codes[code]}",\n'
print(array_string)
