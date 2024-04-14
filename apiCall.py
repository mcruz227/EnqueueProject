import requests

#this python function call the details from the videos. 
#so whenver the user adds a video, the java script even handler will get a USER ID, 
# which then is given to this here and then we can get all the details from the youtube video
api_key = 'AIzaSyDnUbZpNA12WQCmpmottG2Q6GPND08nyBQ'

def get_video_details(query):
    api_url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        'part': 'snippet',
        'q': query,
        'key': api_key
    }
    response = requests.get(api_url, params=params)
    data = response.json()
    return data

    # # Process the response data
    # print("Video details:")
    # print(f"Title: {data['items'][0]['snippet']['title']}")
    # print(f"Description: {data['items'][0]['snippet']['description']}")
    # print(f"Channel: {data['items'][0]['snippet']['channelTitle']}")

# # Example usage
# video_id = input("Enter YouTube video ID: ")
# get_video_details(video_id)







