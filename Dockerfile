#노드 runtime 이 있는 베이스 이미지에서 시작
FROM node:11.14.0-alpine

#저자 정보
LABEL maintainer = 'dott.goo@gmail.com'

#가상 머신에 app 폴더 만들기 - NodeJS 어플리케이션 폴더
RUN mkdir -p /react_app
#winston 등을 사용할떄엔 log 폴더도 생성

#어플리케이션 폴더를 Workdir로 지정 - 서버가동용
WORKDIR /react_app

#서버 파일 복사 ADD [어플리케이션파일 위치] [컨테이너내부의 어플리케이션 파일위치]
#저는 Dockerfile과 서버파일이 같은위치에 있어서 ./입니다
ADD ./ /react_app

#패키지파일들 받기
    RUN npm install
    RUN npm install react-scripts@3.4.1 -g


#배포버젼으로 설정 - 이 설정으로 환경을 나눌 수 있습니다.
ENV NODE_ENV=production

#가상 머신에 오픈할 포트
EXPOSE 3000

#서버실행
CMD ["npm", "start"]
