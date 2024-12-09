import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hash, compare } from "bcrypt";

@Injectable()
export class PasswordService {
    private readonly saltRounds: number;

    constructor(private readonly configService: ConfigService) {
        // 환경 변수에서 해싱 비용을 가져오고, 기본값으로 10을 설정
        this.saltRounds = +this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
    }

    /**
     * 비밀번호를 해싱합니다.
     * @param password - 사용자가 입력한 원본 비밀번호
     * @returns 해싱된 비밀번호
     */
    async hashPassword(password: string): Promise<string> {
        if (!this.isPasswordStrong(password)) {
            throw new Error("비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자 및 특수문자를 포함해야 합니다.");
        }
        return hash(password, this.saltRounds);
    }

    /**
     * 비밀번호를 검증합니다.
     * @param password - 사용자가 입력한 비밀번호
     * @param hashedPassword - 저장된 해싱된 비밀번호
     * @returns 비밀번호가 일치하면 true, 그렇지 않으면 false
     */
    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return compare(password, hashedPassword);
    }

    /**
     * 비밀번호 강도를 확인합니다.
     * @param password - 사용자가 입력한 비밀번호
     * @returns 강력한 비밀번호일 경우 true, 그렇지 않으면 false
     */
    private isPasswordStrong(password: string): boolean {
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
    }

    /**
     * 비밀번호를 검증하고, 필요 시 재해싱합니다.
     * @param password - 사용자가 입력한 비밀번호
     * @param hashedPassword - 저장된 해싱된 비밀번호
     * @returns 재해싱된 비밀번호 또는 null
     */
    async validateAndUpdatePassword(
        password: string,
        hashedPassword: string
    ): Promise<string | null> {
        const isValid = await this.validatePassword(password, hashedPassword);
        if (!isValid) {
            return null; // 비밀번호가 일치하지 않으면 null 반환
        }

        const currentCost = this.saltRounds; // 현재 설정된 해싱 비용
        const storedCost = this.getHashCost(hashedPassword); // 저장된 해싱 비용
        if (currentCost > storedCost) {
            // 해싱 비용이 증가했으면 재해싱
            return this.hashPassword(password);
        }

        return null; // 재해싱이 필요 없으면 null 반환
    }

    /**
     * 저장된 bcrypt 해시에서 해싱 비용(salt rounds)을 추출합니다.
     * @param hashedPassword - 저장된 해싱된 비밀번호
     * @returns 해싱 비용(salt rounds)
     */
    private getHashCost(hashedPassword: string): number {
        return parseInt(hashedPassword.split("$")[2], 10);
    }
}
