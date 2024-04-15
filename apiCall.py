import requests

#this python function call the details from the videos. 
#so whenver the user adds a video, the java script even handler will get a USER ID, 
# which then is given to this here and then we can get all the details from the youtube video
api_key = 'AIzaSyDzPp75YyrVs6G8DaHkTMDwo5JCBqDj63U'

def get_video_details(video_id):
    api_url = "https://www.googleapis.com/youtube/v3/videos"

    params = {
        'id': video_id,
        'key': api_key,
        'part': 'snippet'
    }

    response = requests.get(api_url, params=params)
    data = response.json()

    if 'items' in data and data['items']:
        snippet = data['items'][0]['snippet']
        return {
            'title': snippet['title'],
            'channel': snippet['channelTitle'],
            'thumbnail': snippet['thumbnails']['default']['url']
        }
    else:
        return None






