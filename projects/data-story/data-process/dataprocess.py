import json
import csv

with open('together.csv', "r", newline='') as file:
    with open('output.json', 'w') as jsonOutput:
        with open('data.json', 'r') as scrap:
            with open('coord.txt', 'r') as coord:
                scraplist = json.load(scrap)["data"]
                datalist = []
                reader = csv.DictReader(file)
                for row in reader:
                    row['coordinates'] = coord.readline().strip().split(",")
                    try:
                        row['coordinates'][0] = float(row['coordinates'][0])
                        row['coordinates'][1] = float(row['coordinates'][1])
                    except:
                        row['coordinates'] = ''
                    if row.get('null'):
                        del row['null']
                    row['number'] = row["number"][:5]
                    for s in scraplist:
                        webN = s.get("公布编号") or s.get("编号SN：") or s.get("公布编号：")
                        if webN == row['number'] or (webN == "HP-J-" + row['number'][2:5] + "-V" and row['number'][:2] == '5A'):
                            row['website'] = s
                    for i in range(len(row["address"])):
                        if row["address"][i] in ("，", "、", "（", "(", "/", ",", "\n"):
                            row["address"] = row["address"][:i]
                            break
                        elif row["address"][i] in ("号", "弄"):
                            row["address"] = row["address"][:i+1]
                            break
                    datalist.append(row)
                    
                json.dump(datalist, jsonOutput)
