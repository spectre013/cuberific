package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
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

/* UTILITY FUNCATIONS */
func Json(object interface{}) []byte {
	j, err := json.Marshal(object)
	if err != nil {
		fmt.Println("error:", err)
	}
	return j
}
