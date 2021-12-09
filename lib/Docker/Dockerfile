FROM ubuntu:20.04

ARG USERNAME=instructor
ARG PASSWORD=password
ARG SHELLINABOX_PORT=4217
ARG CODESERVER_PORT

# installing shellinbox and ZSH
RUN apt update && \
    apt install openssl -y && \
    apt install shellinabox -y && \
    apt install zsh -y && \
    apt install git -y && \
    apt install curl -y && \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -y

COPY ./shellinabox /etc/default/shellinabox

# isntalling code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh
COPY ./config.yaml /root/.config/code-server/config.yaml
COPY ./settings.json /root/.local/share/code-server/User/settings.json

RUN useradd -m $USERNAME && \
    echo $USERNAME:$PASSWORD | chpasswd

EXPOSE $SHELLINABOX_PORT
EXPOSE $CODESERVER_PORT

ENTRYPOINT service shellinabox start && code-server
