package password

import "fmt"

func Validate(pw string) error {
	if len(pw) < 8 {
		return fmt.Errorf("senha deve ter pelo menos 8 caracteres")
	}
	if IsCommon(pw) {
		return fmt.Errorf("esta senha e muito comum, escolha outra")
	}
	return nil
}
