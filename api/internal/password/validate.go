package password

import "fmt"

func Validate(pw string) error {
	if len(pw) < 10 {
		return fmt.Errorf("senha deve ter pelo menos 10 caracteres")
	}
	if IsCommon(pw) {
		return fmt.Errorf("esta senha e muito comum, escolha outra")
	}
	return nil
}
