package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"labix.org/v2/mgo/bson"
	"net/http"
	"strings"
)

func Index(w http.ResponseWriter, r *http.Request) {
	Render(w, "index", "")
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	user := strings.ToLower(vars["user"])
	session := getSession()
	defer session.Close()
	profile := new(Profile)
	c := session.DB("cuberific").C("profiles")
	err := c.Find(bson.M{"id": user}).One(&profile)
	if err != nil {
		fmt.Println(err)
	}
	RenderJson(w, profile)
}

func IngestSolves(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["user"]
	session := getSession()
	defer session.Close()
	//8c9e1f32-5420-4db1-42cb-753fb9e7fa6e
	file, err := ioutil.ReadFile("C:/Users/brian.paulson/Desktop/cuberific/solves.json")
	if err != nil {
		fmt.Println("Error Reading File")
		panic(err)
	}
	solves := []Solves{}
	err = json.Unmarshal(file, &solves)
	if err != nil {
		fmt.Println("error:", err)
	}
	c := session.DB("cuberific").C("solves")
	for _, solve := range solves {
		if solve.Id != "" {
			solve.User = userId
			c.Insert(solve)
		}
	}
	RenderJson(w, "success")
}

/* UTILITY FUNCATIONS */
func Json(object interface{}) []byte {
	j, err := json.Marshal(object)
	if err != nil {
		fmt.Println("error:", err)
	}
	return j
}
