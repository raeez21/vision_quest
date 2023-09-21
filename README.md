# vision_quest
# This Readme file describes the installation steps for Vision Quest.

1. Clone the repository
 
    Navigate to any folder and clone the repo by executing:
   
    `git clone https://github.com/raeez21/vision_quest.git`

3. Install the dependencies

   a. Install front end dependencies:  
  `npm install --save $(cat frontend_vision_quest/npm-requirements.txt)`

   b. Install Python dependencies:

   `pip install requirements.txt`
5. Open 2 terminals. On the first terminal start the Node.js server:
  
   `cd frontend_vision_quest`

   `npm run dev`

4. On the second terminal, start the Django server:
   
   `cd vision_quest`
   
   `python manage.py runserver`

5. Now navigate to: http://localhost:3000/ to acess the Vision Quest app 

If you find any issues, feel free to contact me on: mohammadraeez.mec@gmail.com



