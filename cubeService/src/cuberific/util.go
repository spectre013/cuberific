/*
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
package main

/*
import (
	"code.google.com/p/go.crypto/bcrypt"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/nu7hatch/gouuid"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
	"net/http"
	"strings"
)

func AccessCheck(r *http.Request, s *mgo.Session) bool {
	token := r.Header.Get("Authorization")
	if len(token) > 0 {
		authorization := strings.TrimSpace(strings.Replace(token, "Basic ", "", 1))
		login := TokenSplit(authorization)
		validUser := LoginUser(login.Username, login.Password, s)
		if !validUser {
			panic("Unauthorized")
		}
	} else {
		panic("Unauthorized")
	}
	return true
}

func getSolveInfo(SolveId string, s *mgo.Session) Solves {
	c := s.DB("cuberific").C("solves")
	solve := Solves{}
	err := c.Find(bson.M{"id": SolveId}).One(&solve)
	if err != nil {
		fmt.Println(err)
	}
	return solve
}

func LoginUser(username string, password string, s *mgo.Session) bool {
	c := s.DB("cuberific").C("users")
	user := new(User)
	validUser := false
	err := c.Find(bson.M{"username": username}).One(&user)
	if err != nil {
		validUser = false
	}
	if user.Password != password {
		validUser = false
	} else {
		validUser = true
	}
	return validUser
}


func GetUUID() string {
	u4, err := uuid.NewV4()
	if err != nil {
		fmt.Println("error:", err)
		return "Error Creating UUID"
	}
	return u4.String()
}

func clear(b []byte) {
	for i := 0; i < len(b); i++ {
		b[i] = 0
	}
}

func Crypt(password []byte) ([]byte, error) {
	defer clear(password)
	return bcrypt.GenerateFromPassword(password, bcrypt.DefaultCost)
}

func CheckPassword(hash []byte, password []byte) error {
	return bcrypt.CompareHashAndPassword(hash, password)
}
func Token(username string, password string) string {
	data := []byte(username + ":" + password)
	token := base64.StdEncoding.EncodeToString(data)
	return token
}

func TokenSplit(token string) *Login {
	login := new(Login)
	data, err := base64.StdEncoding.DecodeString(token)
	if err != nil {
		fmt.Println("error:", err)
		fmt.Println(data)
		panic("Error")
	}
	auth := strings.Split(string(data), ":")
	if len(auth) != 0 {
		login.Username = auth[0]
		login.Password = auth[1]
	} else {
		fmt.Println(auth)
		panic("Error")
	}
	return login
}
func setResponse(response *Response) (jsonResult []byte) {
	jsonResult, err := json.Marshal(response)
	if err != nil {
		fmt.Println("error:", err)
	}
	jsonResult = []byte(jsonResult)
	return
}
*/
