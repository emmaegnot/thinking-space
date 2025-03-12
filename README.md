# 2024-ThinkingSpace
[Overview](#overview) <br>
[Technology Stack](#technology-stack)<br>
[Stakeholders](#stakeholders)<br>
[User Stories](#user-stories)<br>
[Architecture Diagram](#architecture-diagram)<br>
[User Instructions](#user-instructions)<br>
[Developer Intstructions](#developer-instructions)<br>
[Team Members](#team-members)<br>

## [Gantt Chart](https://uob-my.sharepoint.com/:x:/r/personal/xq23942_bristol_ac_uk/Documents/simple-gantt-chart_ms.xlsx?d=w8333c54edce74b24b194947af8785172&csf=1&web=1&e=Zb0YiD)

## [Kanban](https://github.com/orgs/spe-uob/projects/235)

## Overview

This website aims to tackle behavioural problems in children by providing them with a way to communicate and express themselves through a selection of visual elements. In the standard teaching environment, the student-to-teacher ratio does not allow for behaviour management on a personal level, so we hope that this project will provide children with a safe environment to regulate their mood and feelings.

## Technology Stack

- **Languages:** JavaScript, HTML, CSS, EJS to allow for dynamic pages
- **Back End:** Node.js, using express.js as the framework
- **Database:** MongoDB, using mongoose as an asynchronous javascript object modeling tool
- **Targeted Platform:** Browser

## Stakeholders
- Raymer Enterprise Ltd
  - **Role**: Organisation owner
  - **Aim**: To remotely provide schools with a tool to manage and combat behavioural issues in young children
- Schools
  - **Role**: User of product / client
  - **Aim**: Allow for the maximum teaching time, and allow all students to feel safe and welcome in the learning environment
- Children
  - **Role**: Target audience, main user
  - **Aim**: To allow each child a platform to control and understand their emotions
- Teachers/Staff
  - **Role**: Assisting user
  - **Aim**: Provide teachers with time to teach all children in a class without distraction
- Parents
  - **Role**: Assisting user
  - **Aim**: To understand their child's emotions, and allow them to feel that their child is in capable hands at school

## User stories
- Children: as a child in a classroom, I may struggle with my emotions and that can lead to me disrupting the class, or a teacher spending valuable learning time trying to calm me down. A web app can provide me with the environment to understand and control my emotions, through features such as videos (for more visual learners) or the creative feature of picking a shape and colour. This should help me to focus more effectively in class, and learn more than I otherwise would have, or possibly allow me to get along better with my peers.
- Teacher: teachers naturally want to get the best out of their students, but behavioural issues can cause disruption which can be costly for teaching time. This app will allow my students to focus better, and may even help me connect with them through understanding what they are going through. This should cause a better learning environment for everyone involved.
- Parent: As a parent, I want my child to be getting a good education, and to not feel overly negative emotions. The app should help with both of these issues, allowing my child to focus in class, and providing them with a way to understand and deal with any feelings they may have. This may even help with the burdens of parenting in general, and could have a positive effect on home life too.

## Project structure
Code relating to the project itself can be found in the src folder at root level. Anything outside of this folder are files for Github, Docker, Node.js or generic project work like this README and some research. In src, the code can generally be organised into four sections: database, frontend, backend and CI.
### Database
Within the models folder, we have two pieces of Javascript code, Student.js and Teacher.js. These define the Student and Teacher data structures (reffered to as schemas) that our database uses. It is similar to a class in OOP, where we define the attributes here, and create them later in the server code.
### Backend
Within the server folder, our main backend file, server.js can be found. This is the file we run to get the website up and running. It is decently long, but essentially it describes how our server should react to a multitude of different requests.
### Frontend
The code relating to the frontend can be found in a few different folders within src. First there is the public folder. In the server, we allow users of the website to be able to access anything in this folder. It includes images, font files and our stylesheet file, style.css, which are all needed to enhance the look of the webpages.
There is also the views folder, which contains all of our different .ejs (essentially HTML) pages. These can be fully-defined pages, or partial ones that are then loaded into the other .ejs files.
### Continuous Integration
Within the tests folder, you can find all of the CI tests that Github will automatically run for us each time we push to a branch. They essentially make requests to the server, and compare the actual response with the expected response. There is a different file for each page we test.

## Architecture diagram

![arc-diagram drawio](https://github.com/user-attachments/assets/649f387c-295e-458c-8f54-b2d369a39919)

## User instructions
To access the website on the internet, naviagte to 13.53.72.180:3000, and this should connect you to the website, running on an AWS EC2 instance

Alternatively, to run the website locally using Docker, open this link: https://hub.docker.com/repository/docker/emmaegnot/thinking-space look at the command starting with ```docker pull```, copy that and paste it into the terminal in docker.
Press the play button in the Images section of Docker, and when the pop up appears, in optional settings, set the host port to 3000.
Once the container is running, enter the url http://localhost:3000/ and the website will appear.

## Developer instructions
To host and view the website locally, navigate to the server folder in src, then in the terminal, run ```node server.js ```. On your browser, enter the url http://localhost:3000/ and the website will appear.
### Accessing the database
The server connects to the database using MongoDB Atlas and is done by looking into the .env file (which is not tracked for security) for a connection string
Your own connection string can be generated by:
1. creating a MongoDB Atlas account
2. being added to the ThinkingSpace project
3. adding your IP address to the table of known users
4. connecting to the cluster using drivers
5. Pasting this string in your .env file: MONGO_URI=mongodb+srv://admin_user:<password>@your-cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
6. Replacing the admin_user and password with your one

## Team members

| Name          | Email |
| ------------- | ------------- |
|  Mykola Takun | xq23942@bristol.ac.uk  |
| Anni Liu  | zi23140@bristol.ac.uk  |
| Ethan Rogers | na23961@bristol.ac.uk |
| Emma Tonge | bb23833@bristol.ac.uk |
| Zhongzheng Qu | xb23116@bristol.ac.uk |
| Jackson Yan | po20297@bristol.ac.uk |
