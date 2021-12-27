FROM gitpod/workspace-mysql
RUN sudo apt-get -y update
RUN sudo apt-get install -y ffmpeg
