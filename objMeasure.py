import cv2
import utils

###################################
webcam = False
path = 'cal.png'
cap = cv2.VideoCapture(0)
cap.set(10,160)
cap.set(3,1920)
cap.set(4,1080)
scale = 3
wP = 210 *scale
hP= 297 *scale
###################################
flag=0

img = cv2.imread(path)

imgContours , conts = utils.getContours(img,minArea=50000,filter=4)
if len(conts) != 0:
    biggest = conts[0][2]
    #print(biggest)
    imgWarp = utils.warpImg(img, biggest, wP,hP)
    imgContours2, conts2 = utils.getContours(imgWarp,
                                                minArea=2000, filter=4,
                                                cThr=[50,50],draw = False)
    if len(conts) != 0:
        for obj in conts2:
        #     cv2.polylines(imgContours2,[obj[2]],True,(0,255,0),2)
            nPoints = utils.reorder(obj[2])
            nW = round((utils.findDis(nPoints[0][0]//scale,nPoints[1][0]//scale)/10),1)
            nH = round((utils.findDis(nPoints[0][0]//scale,nPoints[2][0]//scale)/10),1)
            if flag==0:
                print(nW)
                print(nH)
                flag=1
