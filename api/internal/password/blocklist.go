package password

import (
	_ "embed"
	"strings"
)

//go:embed blocklist.txt
var rawBlocklist string

var blocklist map[string]bool

func init() {
	lines := strings.Split(rawBlocklist, "\n")
	blocklist = make(map[string]bool, len(lines))
	for _, line := range lines {
		pw := strings.TrimSpace(strings.ToLower(line))
		if pw != "" {
			blocklist[pw] = true
		}
	}
}

func IsCommon(password string) bool {
	return blocklist[strings.ToLower(password)]
}
