# PetKeep Mobile

Aplicativo móvel do PetKeep, feito com **React Native** e **Expo**.

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- [Expo Go](https://expo.dev/go) (para testar no dispositivo) ou emulador Android / simulador iOS

## Como rodar

1. Instalar dependências (já feito na configuração inicial):

   ```bash
   npm install
   ```

2. Iniciar o app:

   ```bash
   npm start
   ```

   ou, para uma plataforma específica:

   - **Android:** `npm run android`
   - **iOS (apenas macOS):** `npm run ios`
   - **Web:** `npm run web`

3. No terminal, use as teclas ou o QR code para abrir no Expo Go, emulador ou navegador.

## Estrutura do projeto

- **`app/`** – Rotas e telas (roteamento baseado em arquivos com Expo Router)
- **`components/`** – Componentes reutilizáveis
- **`constants/`** – Constantes e tema
- **`hooks/`** – Hooks customizados
- **`assets/`** – Ícones, imagens e splash

## Scripts

| Comando             | Descrição                    |
|---------------------|------------------------------|
| `npm start`         | Inicia o servidor de desenvolvimento |
| `npm run android`   | Abre no emulador Android     |
| `npm run ios`       | Abre no simulador iOS        |
| `npm run web`       | Abre no navegador            |
| `npm run lint`      | Executa o ESLint             |

## Integração com o backend

O backend do PetKeep está em `../petkeep-backend`. Para apontar o app para a API, use variáveis de ambiente (por exemplo com `expo-constants` ou um arquivo `.env` e `react-native-dotenv` / `expo-env`).

## Documentação

- [Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
