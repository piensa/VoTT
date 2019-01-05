import cv2
import json
import optparse
import os


def check_color():#crossed):
    # if crossed:
    #     return (0, 0, 255)
    return (0, 255, 0)


def create_rect(box):
    x1, y1 = int(box['x1']), int(box['y1'])
    x2, y2 = int(box['x2']), int(box['y2'])

    return x1, y1, x2, y2


def create_writer(capture):
    fourcc = cv2.VideoWriter_fourcc(*'X264')
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_count = int(capture.get(cv2.CAP_PROP_FPS))

    writer = cv2.VideoWriter('output.avi',
                             fourcc,
                             frame_count,
                             (width, height))

    return writer


def get_params(frame_data):
    boxes = [f['box'] for f in frame_data]
    ids = [str(f['boxId']) for f in frame_data]
    # crossed = [True if f['crossed'] else False for f in frame_data]

    return boxes, ids#, crossed


def parse_options():
    parser = optparse.OptionParser()
    parser.add_option('-v', '--video',
                      dest='video_path',
                      default=None)
    parser.add_option('-j', '--json',
                      dest='json_path',
                      default=None)
    parser.add_option('-u', '--until',
                      type='int',
                      default=None)
    parser.add_option('-w', '--write',
                      dest='write',
                      action='store_true',
                      default=False)
    options, remainder = parser.parse_args()

    # Check for errors.
    if options.video_path is None:
        raise Exception('Undefined video')
    if options.json_path is None:
        raise Exception('Undefined json_file')

    return options


def Main():
    options = parse_options()

    # Open VideoCapture.
    cap = cv2.VideoCapture(options.video_path)

    # Load json file with annotations.
    with open(options.json_path, 'r') as f:
        data = json.load(f)['frames']

    # Create iterator which stores the frame keys each 60 frames.
    frame_key = [*data.keys()].__iter__()

    if options.write:
        writer = create_writer(cap)

    font = cv2.FONT_HERSHEY_SIMPLEX
    frame_no = 0
    crossed =False
    while True:
        flag, img_ = cap.read()

        if frame_no % 10 == 0:
            print('Processed {0} frames'.format(frame_no))

        if (frame_no) % 6 == 0:
            img = img_.copy()
            boxes, ids = get_params(data.get(frame_key.__next__()))
            multi_tracker = cv2.MultiTracker_create()

            for i, box in enumerate(boxes):
                x1, y1, x2, y2 = create_rect(box)
                retval = multi_tracker.add(cv2.TrackerCSRT_create(),
                                           img,
                                           (x1, y1, x2 - x1, y2 - y1))
                crossed_color = check_color()#crossed[i])
                cv2.rectangle(img, (x1, y1), (x2, y2), crossed_color, 2, 1)
                cv2.putText(img, ids[i], (x1, y1 - 10), font, 1,
                            (0, 0, 0), 5, cv2.LINE_AA)
                cv2.putText(img, ids[i], (x1, y1 - 10), font, 1,
                            crossed_color, 1, cv2.LINE_AA)
        # else:
        #     img = img_no_edit.copy()
        #     success, boxes = multi_tracker.update(img)
        #     # draw tracked objects
        #     for i, newbox in enumerate(boxes):
        #         p1 = (int(newbox[0]), int(newbox[1]))
        #         p2 = (int(newbox[0] + newbox[2]), int(newbox[1] + newbox[3]))

        #         crossed_color = check_color()#crossed[i])
        #         cv2.rectangle(img, p1, p2, crossed_color, 2, 1)
        #         cv2.putText(img, ids[i], (p1[0], p1[1] - 10), font, 1,
        #                     (0, 0, 0), 5, cv2.LINE_AA)
        #         cv2.putText(img, ids[i], (p1[0], p1[1] - 10), font, 1,
        #                     crossed_color, 1, cv2.LINE_AA)


        if options.write:
            writer.write(img)
        else:
            cv2.imshow('frame', img)
            if cv2.waitKey(25) & 0xFF == ord('q'):
                break
        if frame_no == options.until:
            break
        frame_no += 1

    cap.release()
    if options.write:
        writer.release()


if __name__ == '__main__':
    Main()
