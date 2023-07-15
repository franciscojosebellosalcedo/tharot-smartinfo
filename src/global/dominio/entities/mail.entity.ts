export interface CreateDataMail {
    titulo: string
    asunto: string
    body: string
}

export interface UpdateDataMail {
    titulo?: string
    asunto?: string
    body?: string
}

export interface ConfigMailer {
    host: string
    port: number
    secure: number
    email: string
    secret: string 
}

export interface UpdateConfigMailer {
    host?: string
    port?: number
    secure?: number
    email?: string
    secret?: string 
}