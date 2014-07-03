package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"text/template"
)

var funcMap = template.FuncMap{
	"tile": strings.ToTitle,
}

func Render(w http.ResponseWriter, templates string, data interface{}) {
	var err error
	temp := strings.Split(templates, ",")
	w.Header().Set("content-type", "text/html")
	t := template.New("main").Delims("<?", "?>").Funcs(funcMap)
	for _, templ := range temp {
		tmpl := readTemplate(templ)
		if t, err = t.Parse(tmpl); err != nil {
			fmt.Printf("parse error: %v\n", err)
		}
		fmt.Println("Added Template: " + templ)
	}
	err = t.Execute(w, data)
	if err != nil {
		fmt.Println(err)
	}
}

func RenderJson(w http.ResponseWriter, data interface{}) {
	w.Write(Json(data))
}

func readTemplate(file string) string {
	temp, err := ioutil.ReadFile("templates/" + file + ".html")
	if err != nil {
		fmt.Println("Error loading Template")
		fmt.Println(err)
		temp, err = ioutil.ReadFile("templates/reports/reporterror.html")
		if err != nil {
			fmt.Println(err)
		}
	}
	return string(temp[:])
}
