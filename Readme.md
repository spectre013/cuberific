# Cuberific

Cuberific is a Rubik's Cube timer web application. The back end service is written in Go [Golang.org](http://Golang.org/). The front end is an [Angular JS](https://angularjs.org/) application. On the web server front [Nginx](https://nginx.org/) was used to serve the Angular JS application and proxy the Go web service. For the database [MongoDB](http://www.mongodb.org/) was used. 

### THIS APPLICATION IS NOT READY FOR PRODUCTION USE

Shortcuts were taken with some aspects of security and would need to be fixed before used in production. 

-	Currently no password to connect to mongo
-	API Security needs more work.  

## Disclaimer

If you find and errors with this documentation please let me know and I will update the document ASAP. As well if you modify the code and wish to have it added to the repository issue pull requests. 

Also keep in mind I was learning both Angular and GO when working on this application so it may not be a perfect example of how to write Go/Angular code properly. With that said I have a couple thousand solves in my local server that I have been running.  

## Prerequisites

- 	Golang [http://golang.org/](http://golang.org/)
-	Nginx [http://nginx.org/](http://nginx.org/)
-	MongoDB [http://www.mongodb.org/](http://www.mongodb.org/)
-	GOHOME and GOPATH Environment variables set correctly

## Getting the code

	$ git clone https://github.com/spectre013/cuberific

## building the go service

Since this is the complete application and Cuberfic was not meant as a go library it is not set up to be used with go get. 

A couple things need to be done before we can run the service. 

1.	Create a database called cuberific in your MongoDB Server.
2.	Open main.go and go to line 386 and change the path to the solves.json (only need to do this if you want to import some solves for testing purposes)

	$ cd $PATH TO CODE/src/cuberific
	$ go build
	$ cuberific

Eventually you will want to run the cuberific as a service. For now it would be best to run in the console until you have every thing working correctly.

## Web Front end

Only changes that need to be made here is to add the domain for the cookies to be stored in. 

Navigate to /var/www/vhosts/<SITE_NAME>/httpdocs/js/controllers.js and open it in your editor of choice. 

Replace <SITE_NAME> with the domain name / IP your are using to access the site.

## Nginx conf

For a front facing server Nginx was used. Below is the site configuration that will work. Replace <SITE_NAME> in the root to the path where the code is, and the <SITE_NAME> in the server_name line with the domain/IP that you want Nginx to respond to. 

The port in the proxy_pass line will need to change if the Go server is running on a different port.

	server {
	        listen 80;

	        root /var/www/vhosts/<SITE_NAME>/httpdocs;
	        index index.html index.htm;

	        # Make site accessible from http://localhost/
	        server_name <SITE_NAME>;

	        location / {
	                # First attempt to serve request as file, then
	                # as directory, then fall back to displaying a 404.
	                try_files $uri $uri/ /index.html /api;
	                # Uncomment to enable naxsi on this location
	                # include /etc/nginx/naxsi.rules
	        }
	        location /api {
	                proxy_pass        http://localhost:9090;

	                proxy_set_header Host $host;
	                proxy_set_header X-Real-IP  $remote_addr;
	                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	                proxy_redirect   off;
	       }

	}


start the server and navigate to http://localhost or the domain or IP used to create the server. 

## Getting Started

Navigate to the domain / IP used in the Nginx section and you should be presented with the web application if not please view the Nginx logs or the console that the go service is running in to look for errors. 


## Mongo Collections

In this file you will find the collections for mongo. This is mostly for reference as the application will create the applications as needed. 

## License 

MIT License

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.