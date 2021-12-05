FROM ubuntu:20.04

ARG USERNAME=instructor
ARG PASSWORD=password
ARG PORT=4217

RUN apt update
RUN apt install openssl -y 
RUN apt install shellinabox -y
RUN useradd -m $USERNAME
RUN echo $USERNAME:$PASSWORD | chpasswd

COPY ./shellinabox /etc/default/shellinabox
EXPOSE $PORT

# ENTRYPOINT bash && service shellinabox start