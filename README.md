# EnqueueProject

Group Project creating a Chrome Extesnion aimed to improve Youtube's queue and watch later feature.
Users will be able to drop a link of their youtube videos to always have access to it in any tab, allowing them to sort organize and sort the videos they want saved.

html file: defines the structure of the chrome extension's interface.

css file: provide the style of those html elements.

python file: handles requests from teh chrome extension to fetch details about a youtube video using RapidApi YouTube API. it sends a request to the youtube api with video ID and retirved the details(title, description, channel) to send back to the chrom extension.

json file: this is the configuration for the chrome extension. it has the name, version, description, permission, and the html file to load.

javascript file: controls the behaviro of teh extension. toggles sortin gorder when user clicks sorting button, adds a video to the interface when user click on shiffle button. it also gives use a layout for each video link such as its thumbnail, title, and delete button, and sends the id of a youtube video to the backend serve to fetch details about it.
