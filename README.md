# vision_quest
This Readme file describes the installation steps for Vision Quest.

1. Clone the repository
Inside any folder, clone the repo by executing: git clone https://github.com/raeez21/vision_quest.git

2. Install the dependencies
npm install --save $(cat frontend_vision_quest/npm-requirements.txt)
pip install requirements.txt

3. Open 2 terminals. On the first terminal start the Node.js server:
cd frontend_vision_quest
npm run dev

On second terminal start the Django server
cd vision_quest
python manage.py runserver

If you fing any issues, feel free to contact me on: mohammadraeez.mec@gmail.com



