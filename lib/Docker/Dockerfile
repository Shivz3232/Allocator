FROM ubuntu:20.04

ARG USERNAME=instructor
ARG PASSWORD=password
ARG SHELLINABOX_PORT=4217
ARG CODESERVER_PORT

# installing shellinbox
RUN apt update
RUN apt install openssl -y
RUN apt install shellinabox -y

# installing zsh
RUN apt install zsh -y
RUN apt install git -y
RUN apt install curl -y
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -y

COPY ./shellinabox /etc/default/shellinabox

# isntalling code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh
COPY ./config.yaml /root/.config/code-server/config.yaml

RUN useradd -m $USERNAME
RUN echo $USERNAME:$PASSWORD | chpasswd

EXPOSE $SHELLINABOX_PORT
EXPOSE $CODESERVER_PORT


ENTRYPOINT service shellinabox start && code-server

