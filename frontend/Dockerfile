FROM node:7-alpine

WORKDIR /frontEnd

COPY package.json /frontEnd

RUN npm install

COPY . /frontEnd

CMD [ "npm", "start" ]

EXPOSE 3000