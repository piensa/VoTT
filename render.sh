# VideoName=$(ls *.mp4)
# echo "$VideoName"


video="20171010_prolix_downtown_palo_alto_6-10-10-2017_18-13-23.concat.12fps.mp4"
pathDrive="Drive/VoTT/concat/20171010_prolix_downtown_palo_alto_6-10-10-2017_18-13-23.concat.12fps_jesus_finish"

pathProlix="prolix/12fps-concat"
pathVideo="${pathProlix}/${video}"
pathJson="${pathDrive}/${video}.json"
pathJsonCross="${pathDrive}/${video}_crossed.json"
pathJsonCrossMatch="${pathDrive}/${video}_crossed_matched.json"
csvCross="${pathDrive}/cross.csv"
csvMatch="${pathDrive}/match.csv"




node crossed.js $pathJson $csvCross
node match.js $pathJsonCross $csvMatch

sleep 2

echo "rendering video..."
python3 ./src/scripts/tracker.py --video $pathVideo --json $pathJsonCrossMatch --write