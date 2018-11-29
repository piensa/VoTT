import cv2
import json
import os

def create_rect(box, tuples=False):
    x1, y1 = int(box['x1']), int(box['y1'])
    x2, y2 = int(box['x2']), int(box['y2'])

    if tuples is False:
        return (x1, y1, x2 - x1, y2 - y1)

    return (x1, y1), (x2, y2)


def get_boxes(frame_data):
    return [f['box'] for f in frame_data]


def Main():
    video_path = '/Users/jorge/Videos/test'

    # Open VideoCapture.
    cap = cv2.VideoCapture(os.path.join(video_path, 'video.mp4'))

    # Load json file with annotations.
    with open(os.path.join(video_path, 'data.json'), 'r') as f:
        data = json.load(f)['frames']

    # Create iterator which stores the frame keys each 60 frames.
    frame_key = [*data.keys()].__iter__()

    frame_no = 0


    fourcc = cv2.VideoWriter_fourcc(*'X264')
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))

    writer = cv2.VideoWriter('output.avi', fourcc,
                             int(cap.get(cv2.CAP_PROP_FPS)),
                             (width, height))

    while True:
        print(frame_no)
        flag, img = cap.read()

        # Create list of trackers each 60 frames.
        if frame_no % 60 == 0:
            boxes = get_boxes(data.get(frame_key.__next__()))
            multi_tracker = cv2.MultiTracker_create()

            for box in boxes:
                multi_tracker.add(cv2.TrackerCSRT_create(), img,
                                 create_rect(box, False))

            p1, p2 = create_rect(box, True)
            cv2.rectangle(img, p1, p2, (0, 255, 0), 2, 1)

        else:
            success, boxes = multi_tracker.update(img)
            # draw tracked objects
            for i, newbox in enumerate(boxes):
                p1 = (int(newbox[0]), int(newbox[1]))
                p2 = (int(newbox[0] + newbox[2]), int(newbox[1] + newbox[3]))
                cv2.rectangle(img, p1, p2, (0, 255, 0), 2, 1)

        if frame_no < int(cap.get(cv2.CAP_PROP_FRAME_COUNT)):
            writer.write(img)
        else:
            writer.release()
            cap.release()
            exit()
        frame_no += 1

if __name__ == '__main__':
    Main()

