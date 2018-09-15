from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage
import os

APP = ClarifaiApp(api_key="a11ec80513f94400a2caf2867db4bca6")

# APP.inputs.delete_all()

# app.inputs.delete_all()


def sendData(letter):

    FOLDER_PATH="/Users/singhdas/Downloads/asl-alphabet/asl_alphabet_train/" + letter.upper() + "/"
    alphabets = "abc"
    count = 0
    lst = []
#
    for filename in os.listdir(FOLDER_PATH):
        if  (filename >= "C1550.jpg" and count < 128):
            count += 1
            not_concepts = list(alphabets.replace(letter.lower(), ""))
            lst.append(ClImage(filename=FOLDER_PATH+filename, concepts=[letter.lower()],not_concepts=not_concepts))
            # break
    # print(lst)
    APP.inputs.bulk_create_images(lst)
    print("Done")

# model = app.models.create('test')
#
def predict(imagefile):

    model = APP.models.get('production')

    image = ClImage(filename=imagefile)
    # #
    x = model.predict([image])
    #
    # print(x)
    con = x["outputs"][0]["data"]["concepts"]
    for d in con:
    	print(d["name"], d["value"])

if __name__ == "__main__":
    # alphabets = "ab"
    # sendData("c")
    # model = APP.models.create("production", concepts=list(alphabets))
    # APP.inputs.merge_concepts('production', concepts=list(["a"]), not_concepts=["b"])
    predict("/Users/singhdas/Desktop/5.jpg")
