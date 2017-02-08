# emergeadapt_exercise

A small application for my EmergeAdapt exercise. A simple AngularJS app which allows the user to input a client reference number to retrieve associated enquiries.

To run the application, navigate to the directory and start an HTTP server on port 4600. I had two ways of doing this, with Node.js and Python.

#### Node.js:
```
http-server -p 4200
```

#### Python:
```
python -m SimpleHTTPServer 4200
```

## Notes
- Followed a [scotch.io] (https://scotch.io/tutorials/single-page-apps-with-angularjs-routing-and-templating) AngularJS routing tutorial for the initial groundwork.

- Used a Python script (which requires the requests library) to check for other client case reference numbers to test the application (ranging from 0 to 9999) but only found 29, the initial number given. The script can be found in the repository.
