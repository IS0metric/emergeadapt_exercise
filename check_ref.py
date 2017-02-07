import requests

if __name__ == "__main__":
    starting_number = 10000
    for ref_number in range(0, starting_number):
        url = "https://login.caseblocks.com/case_blocks/search?query=client_reference:"+str(ref_number)+"&auth_token=bDm1bzuz38bpauzzZ_-z"#
        r = requests.get(url)
        if r.status_code != 200:
            print "BROKEN ID:", ref_number
        else:
            if r.json() != []:
                print "DETAILED RESPONSE:", ref_number
    print "CHECKED", starting_number, "REFERENCE NUMBERS"
