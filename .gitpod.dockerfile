FROM gitpod/workspace-postgres
RUN sudo apt-get -y update
RUN sudo apt-get install -y ffmpeg
