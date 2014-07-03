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
	"fmt"
	"labix.org/v2/mgo/bson"
	"math"
	"strconv"
	"strings"
	"time"
)

const MaxInt = int(^uint(0) >> 1)
const MinInt = -(MaxInt - 1)

func getSolves(userId string, cubeType int, userSession int) []Solves {
	session := getSession()
	defer session.Close()
	c := session.DB("cuberific").C("solves")
	result := []Solves{}
	query := bson.M{"type": cubeType, "user": userId, "session": userSession, "dnf": false}
	if userSession == -1 {
		query = bson.M{"type": cubeType, "user": userId, "dnf": false}
	}
	iter := c.Find(query).Sort("-date").Iter()
	err := iter.All(&result)
	if err != nil {
		fmt.Println(err)
	}
	return result
}

func Best(solves []Solves) Stat {
	best := MaxInt
	for _, solve := range solves {
		if solve.Dnf {
			continue
		}
		if solve.Penalty {
			solve.Time = solve.Time + 2000
		}
		if solve.Time <= best {
			best = solve.Time
		}
	}
	return setReturn(best)
}

func Worst(solves []Solves) Stat {
	worst := MinInt
	for _, solve := range solves {
		if solve.Dnf {
			continue
		}
		if solve.Penalty {
			solve.Time = solve.Time + 2000
		}
		if solve.Time >= worst {
			worst = solve.Time
		}
	}
	return setReturn(worst)
}

func Average(solves []Solves, of int) Stat {
	// if number of DNFs is greater than one, return DNF
	//for _, solve := range solves[0:of] {
	//	if solve.Dnf {
	//		return setReturn(-1)
	//	}
	//}

	worst := MinInt
	best := MaxInt

	var sum int
	for _, solve := range solves[0:of] {
		if solve.Dnf {
			continue
		}
		if solve.Penalty {
			solve.Time = solve.Time + 2000
		}
		if solve.Time > worst {
			worst = solve.Time
		}

		if solve.Time < best {
			best = solve.Time
		}
		sum += solve.Time
	}
	return setReturn((sum - worst - best) / (of - 2))
}

func BestAverage(solves []Solves, of int) Stat {
	bestAverage := MaxInt
	for i := 0; i < len(solves); i++ {
		worst := MinInt
		best := MaxInt
		sum := 0
		if i+of > len(solves) {
			sum = MaxInt
			break
		}
		for _, solve := range solves[i : i+of] {
			if solve.Dnf {
				continue
			}
			if solve.Penalty {
				solve.Time = solve.Time + 2000
			}
			if solve.Time > worst {
				worst = solve.Time
			}

			if solve.Time < best {
				best = solve.Time
			}

			sum += solve.Time
			if sum == MaxInt {
				continue
			}
		}
		average := (sum - worst - best) / (of - 2)
		if average < bestAverage {
			bestAverage = average
		}
	}
	return setReturn(bestAverage)
}

func Mean(solves []Solves, of int) Stat {
	sum := 0
	for _, solve := range solves[0:of] {
		if solve.Dnf {
			continue
		}
		if solve.Penalty {
			solve.Time = solve.Time + 2000
		}
		sum += solve.Time
	}
	return setReturn(sum / of)
}

func BestMean(solves []Solves, of int) Stat {
	bestMean := MaxInt
	for i := 0; i < len(solves); i++ {
		sum := 0
		if i+of > len(solves) {
			sum = MaxInt
			break
		}
		for _, solve := range solves[i : i+of] {
			if solve.Dnf {
				continue
			}
			if solve.Penalty {
				solve.Time = solve.Time + 2000
			}
			sum += solve.Time
		}

		if sum == MaxInt {
			continue
		}

		mean := sum / of

		if mean < bestMean {
			bestMean = mean
		}
	}
	return setReturn(bestMean)
}

func StandardDeviation(solves []Solves) Stat {
	if len(solves) == 0 {
		return setReturn(0)
	}

	mean := 0
	for _, solve := range solves {
		if solve.Penalty {
			solve.Time = solve.Time + 2000
		}
		mean += solve.Time
	}
	mean /= len(solves)

	variance := 0.0
	for _, solve := range solves {
		variance += math.Pow(float64(solve.Time-mean), 2.0)
	}
	variance /= float64(len(solves))
	return setReturn(int(math.Sqrt(variance)))
}

func setReturn(value int) Stat {
	stat := Stat{}
	stat.Time = value
	if value == -1 {
		stat.Display = "DNF"
	} else {
		if value != 0 {
			sTime, err := time.ParseDuration(strconv.Itoa(value) + "ms")
			if err != nil {
				fmt.Println(err)
			}
			display := strings.Replace(sTime.String(), "m", ":", 1)
			stat.Display = strings.Replace(display, "s", "", 1)
		} else {
			stat.Display = "0.0"
		}

	}
	return stat
}
*/
