# AllToghether
AllToghether is MERN stack web app where interns of company take answers ( videos ) on questions on pandemic.

On React frontend users take videos with webcam which are submitted to Node server. Admins can view videos on admin panel.

Basic styling, it was created in rush during Covid-19 pandemic.

![Open](https://github.com/kuzma031/allTogether/blob/master/screenshots/open.png)
![Questions](https://github.com/kuzma031/allTogether/blob/master/screenshots/questionline.png)
![Camera](https://github.com/kuzma031/allTogether/blob/master/screenshots/camera.png)

### Server

Node.js: 

* Express server
* MongoDb with Mongoose
* Multer to upload videos
* Videos are uploaded to Amazon S3
* Simple admin panel, CRUD on questions, CRUD on users and view videos by each user

### Frontend

* React frontend
* WebRTC used for taking videos
* Context API for state management
* Each video have recording time, which is editable by admin on backend