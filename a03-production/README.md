# A03 Production

Repo for A03. <br>
**Adam Rashdan**<br>
ar223hf@student.lnu.se.<br>



Available Scripts
----------------------


### npm install 

Install your dependencies.



### npm start

Runs the app.<br>
Open http://localhost:3000 to view it in the browser.

--------------------------------------------


### Q1
1. My application URL is [A03 Production URL](https://cscloud8-119.lnu.se/event)

### Q2
To make my application secure

- Using Nginx as a reversed proxy in my application.
- Using environment variables for my Gitlab token and my webhook token.
- Checking if record that comes to my webhook route contains my SECRET TOKEN.
- The client side javascript has no access to Gitlab data or API.
- Proxy runs on HTTPS.


### Q3 

1. I am using Nginx as my reversed proxy and redirect all traffic from port 443 to port 3000. 
   The reverse proxy also handles TLS encryption between a client and a server.
   <br><br>
   
2. I am using PM2 as my Process Manager to ensures that my application is running
   and in case my application crashed, PM2 starts it again.
   <br> <br>
   
3. To encrypt the connection between client and server TLS certificates are used, 
   which secure the data sent between client and server.
   <br> <br>
   
4. Environment variables are used to tell an application on how to run in a 
   certain environment or provide other information about the environment. 
   In my case, I used the environment variable to defined in which mode 
   my application should run along with storing the tokens for Gitlab and webhook.


### Q4 
Development vs. Production
In my case, it is primarily express that optimizes itself through cashing 
when you run the application in production.
This allows the application to handle more traffic. 
As for Development, I used specific code that tests some parts 
of my code like the WebSocket emissions and events or using Morgan 
as a logger to test in localhost.


### Q5 
I used socket.io to create a connection between server-side and client-side to 
be able to get the data in real-time. Also, I used moment to format the time 
and render it in desirable form. As for the security of these modules, 
I can not argue much, but I think that those modules are secure enough since 
they have a huge number of Weekly Downloads from different developers.

### Q6
No extra features have been implemented for this assignment.

### Q7
I am actually satisfied with my application especially the architecture
because it is easy to follow and change and since it fulfills the assignment requirement.
As for the improvement area, I feel that it needs some improvement in the 
view but since it is a backend course I think it is fine to be like this 


### Q8

My TIL for this course part are

- How to deal with Socket.io to create a connection between the client and server side.
- Dealing with webhook and tokens from gitlab.
- How to deploy my application on a real server along with adding HTTPS to my server.
- Nginx and configuration for Reversed proxy.
- What is Process manager and how to use it.
- Tls certificates and Environment variables.