# 2024-ThinkingSpace
[Overview](#overview)  
[Technology Stack](#technology-stack)  
[Stakeholders](#stakeholders)  
[User Stories](#user-stories)  
[Project Structure](#project-structure)  
[Architecture Diagram](#architecture-diagram)  
[User Instructions](#user-instructions)  
[Developer Instructions](#developer-instructions)  
[Team Members](#team-members)  

## [Gantt Chart](https://uob-my.sharepoint.com/:x:/r/personal/xq23942_bristol_ac_uk/Documents/simple-gantt-chart_ms.xlsx?d=w8333c54edce74b24b194947af8785172&csf=1&web=1&e=Zb0YiD)

## [Kanban](https://github.com/orgs/spe-uob/projects/235)

## Overview
This website aims to tackle behavioural problems in children by providing them with a way to communicate and express themselves through a selection of visual elements. In the standard teaching environment, the student-to-teacher ratio does not allow for behaviour management on a personal level, so we hope that this project will provide children with a safe environment to regulate their mood and feelings.

## Technology Stack
- **Languages:** JavaScript, HTML, CSS, EJS to allow for dynamic pages
- **Back End:** Node.js, using express.js as the framework
- **Database:** MongoDB, using mongoose as an asynchronous javascript object modeling tool
- **Targeted Platform:** Browser, designed for desktops/laptops

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
  - **Aim**: To understand their child's emotions, and ensure they feel their child is in capable hands at school

## User stories
- Children: as a child in a classroom, I may struggle with my emotions and that can lead to me disrupting the class, or a teacher spending valuable learning time trying to calm me down. A web app can provide me with the environment to understand and control my emotions, through features such as videos (for more visual learners) or the creative feature of picking a shape and colour. This should help me to focus more effectively in class, and learn more than I otherwise would have, or possibly allow me to get along better with my peers.
- Teacher: teachers naturally want to get the best out of their students, but behavioural issues can cause disruption which can be costly for teaching time. This app will allow my students to focus better, and may even help me connect with them through understanding what they are going through. This should cause a better learning environment for everyone involved.
- Parent: As a parent, I want my child to be getting a good education, and to not feel overly negative emotions. The app should help with both of these issues, allowing my child to focus in class, and providing them with a way to understand and deal with any feelings they may have. This may even help with the burdens of parenting in general, and could have a positive effect on home life too.

## Project structure
Code relating to the project itself can be found in the src folder at root level. Anything outside of this folder are files for Github, Docker, Node.js or generic project work like this README and some research. In src, the code can generally be organised into four sections: database, frontend, backend and CI.
### Database
Within the models folder, we have two pieces of Javascript code, Student.js and Teacher.js. These define the Student and Teacher data structures (referred to as schemas) that our database uses. It is similar to a class in OOP, where we define the attributes here, and create them later in the server code.
The Entity relationship diagram can be seen here:
![erd](image.png)
### Backend
Within the server folder, our main backend file, server.js can be found. This is the file we run to get the website up and running. It is decently long, but essentially it describes how our server should react to a multitude of different requests.
### Frontend
The code relating to the frontend can be found in a few different folders within src. First there is the public folder. In the server, we allow users of the website to be able to access anything in this folder. It includes images, font files and our stylesheet file, style.css, which are all needed to enhance the look of the webpages.
There is also the views folder, which contains all of our different .ejs (essentially HTML) pages. These can be fully-defined pages, or partial ones that are then loaded into the other .ejs files.
### Continuous Integration
Within the tests folder, you can find all of the CI tests that Github will automatically run for us each time we push to a branch. They essentially make requests to the server and compare the actual response with the expected response. There is a different file for each page we test.

## Architecture diagram

![arc-diagram drawio](https://github.com/user-attachments/assets/649f387c-295e-458c-8f54-b2d369a39919)

## User instructions
### Accessing the website
To access the website on the internet, navigate to https://www.thethinkingspace.me/ , and this should connect you to the website, running on an AWS EC2 instance

Alternatively, to run the website locally using Docker, open this link: https://hub.docker.com/repository/docker/emmaegnot/thinking-space look at the command starting with ```docker pull```, copy that and paste it into the terminal in docker.
Press the play button in the Images section of Docker, and when the pop up appears, in optional settings, set the host port to 3000.
Once the container is running, enter the url http://localhost:3000/ and the website will appear.

### Navigating the website
#### For Students
From the home page, press the 'Student' button. After this you will be taken to a login page, where you will need to enter your name and your teacher's name. Press the login button and you will be taken to the main part of the website. Here, you will create a character based on your emotions. Follow the instructions, and we will try to match you with an appropriate mood! Once you reach this point (the page labelled 'Mood Matcher'), you can continue by entering some additional information about your mood and situation. The experience will end by you getting the opportunity to play our game, Feeling Families. Hopefully after this, you will feel like you are able to understand and control your emotions!
#### For Teachers
From the home page, select the 'Teacher' button. After this, you will be taken to a login page, where you will need to enter your name and password. There is no functionality for creating an account - this is managed by Raymer Enterprises, so if you cannot remember part of your login (or need to create an account) you need to contact them. Once you have successfully logged in, you will be taken to the student info page. Here you will see a summary of any students in your class that have used our website. This includes name, matched mood, and the time they did this. Note that, if there are lots of students in the table, you will be able to scroll down. The table is sorted from newest to oldest, so the most relevant entries will appear at the top.

## Developer instructions
To host and view the website locally, navigate to the server folder in src, then in the terminal, run ```node server.js```. On your browser, enter the url http://localhost:3000/ and the website will appear.
To access the website on the internet, navigate to 13.53.72.180:3000, and this should connect you to the website, running on an AWS EC2 instance. With every merge to the dev branch, our GitHub actions will use our Continuous Development setup to automatically deploy the changes. However, when working on a branch, it is recommended to test the site locally first, as it is best practice to only deploy a website that has been reviewed and confirmed to work.
### Accessing the database
The server connects to the database using MongoDB Atlas and is done by looking into the .env file for a connection string. You are responsible for creating your own .env file, as GitHub should not be tracking this for security reasons.
> [!NOTE]  
> The location of your .env will depend on how you choose to run the server. If you are navigating into the src/server folder and running ```node server``` then it should be placed in that folder too. If instead, you are running the server from the root by using ```node src/server/server``` then the .env file should also be placed in the root.

Your own connection string can be generated by:
1. creating a MongoDB Atlas account
2. being added to the ThinkingSpace project
3. adding your IP address to the table of known users
4. connecting to the cluster using drivers
5. Pasting this string in your .env file: MONGO_URI=mongodb+srv://admin_user:password@your-cluster.mongodb.net/myDatabase?retryWrites=true&w=majority
6. Replacing the admin_user and password with your one

### Accessing the EC2 Node
The IP address of the instance is 13.53.72.180, and this is an elastic IP so should not change.
Port 3000 is open to any IP address, and this is where the server listens to requests and hosts the website.
Port 22 is also open, but to a limited range of IP addresses. This port allows a user to SSH into the instance and run commands such as docker and git. In order to add your IP address to the range you must:
1. Log into the AWS account
2. Navigate to the EC2 Page
3. Find the security groups tab on the left
4. Edit inbound rules for the group named launch-wizard-1 - this is the one associated with the instance.
5. Add a new SSH rule, and make its source your current IP address
Following this, you will also need your own SSH key. To generate one, you must
1. Log into the AWS account
2. Navigate to the EC2 page
3. In the left menu, click Key Pairs (under "Network & Security").
4. Click Create Key Pair.
5. Enter a Key Pair Name (e.g., new-key).
6. Choose a type and format
7. Click Create Key Pair and download the file (making sure it is stored securely).
8. Go to EC2 Dashboard then Click your Instance ID.
9. Go to Click Actions then Manage Sessions then Start Session. Once inside, run:
```
cd ~/.ssh
echo "YOUR_NEW_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
Using this key, you should now be able to securely connect to the instance though SSH. You can use the command
```
ssh -i /path/to/new-key.pem ec2-user@13.53.72.180
```
## Team members

| Name          | Email |
| ------------- | ------------- |
|  Mykola Takun | xq23942@bristol.ac.uk  |
| Anni Liu  | zi23140@bristol.ac.uk  |
| Ethan Rogers | na23961@bristol.ac.uk |
| Emma Tonge | bb23833@bristol.ac.uk |
| Zhongzheng Qu | xb23116@bristol.ac.uk |
| Jackson Yan | po20297@bristol.ac.uk |
