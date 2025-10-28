# create-zama-app

Generator proyek untuk dApp FHEVM berbasis React, Next.js, atau Vue.

Versi saat ini: `create-zama-app@0.1.0`

## Ringkas
- Membuat scaffolding proyek dApp siap pakai dengan integrasi FHEVM.
- Template: `react`, `next`, `vue`.
- Menggunakan impor SDK `@fhevm-sdk` yang dipetakan ke paket terpublikasi `fhevm-sdk-zama@^0.1.0` agar bisa dipakai langsung tanpa ubah kode.

## Prasyarat
- `Node.js >= 18` dan `npm >= 9`.
- `git` (opsional, untuk mengelola proyek).
- Ekstensi wallet seperti MetaMask (opsional, untuk uji interaksi on-chain).

## Instalasi Cepat
- Interaktif:

```bash
npx create-zama-app@latest
```

- Non-interaktif (langsung pilih template dan nama proyek):

```bash
# Vue
npx create-zama-app my-zama-app -t vue

# React
npx create-zama-app my-zama-app -t react

# Next.js
npx create-zama-app my-zama-app -t next
```

Anda juga bisa menggunakan:

```bash
npm create zama-app@latest
```

## Opsi CLI
- Argumen: `[project-name]` — nama folder proyek yang akan dibuat.
- Flag: `-t, --template <react|next|vue>` — memilih template framework.

## Template yang Tersedia
- `react`: Vite + React + Tailwind + integrasi FHEVM dasar.
- `next`: Next.js + Wagmi/RainbowKit + contoh hook FHEVM.
- `vue`: Vite + Vue + Pinia + Tailwind + utilitas FHEVM siap pakai.

Semua template:
- Mengimpor SDK dengan `import ... from '@fhevm-sdk'`.
- Secara internal dipetakan ke `npm:fhevm-sdk-zama@^0.1.0` di `package.json` agar siap install.

## Setelah Generate
Masuk ke folder proyek lalu jalankan:

```bash
cd my-zama-app
npm install
npm run dev
```

Beberapa template menyediakan skrip tambahan:
- `generate:abi`: menghasilkan file ABI dari kontrak contoh.
- `deploy:local`: deploy ke Hardhat lokal (`http://localhost:8545`).
- `deploy:sepolia`: deploy ke Sepolia (butuh API key & private key).

## Catatan SDK & Relayer
- Template memakai impor `@fhevm-sdk` yang sudah dipetakan ke `fhevm-sdk-zama@^0.1.0` via alias npm.
- Jika Anda ingin mengganti versi SDK, ubah di `package.json` proyek:

```json
{
  "dependencies": {
    "@fhevm-sdk": "npm:fhevm-sdk-zama@^0.1.1"
  }
}
```

- Integrasi relayer tersedia via `@zama-fhe/relayer-sdk` pada template yang relevan.

## Troubleshooting
- Windows PowerShell: gunakan tanda kutip sesuai kebutuhan saat melewatkan argumen.
- Versi Node: pastikan `>= 18`. Error ESM/TS biasanya hilang dengan versi terbaru.
- Jaringan: pastikan chain yang dipilih tersedia (`localhost`/`sepolia`).
- Ethers v6 dan Vue reactivity: template sudah memakai `markRaw`/`toRaw` untuk mencegah error "Cannot read from private field".
- Vite `optimizeDeps`: template sudah meng-include `ethers` dan `@fhevm-sdk` yang valid.

## Upgrade ke Scope Resmi (opsional)
Jika nanti SDK tersedia di scope organisasi (mis. `@zama-fhe/fhevm-sdk`), Anda bisa mengubah alias di `package.json` proyek:

```json
{
  "dependencies": {
    "@fhevm-sdk": "npm:@zama-fhe/fhevm-sdk@^0.1.0"
  }
}
```

Tanpa ubah kode sumber, impor `@fhevm-sdk` akan tetap berfungsi.

## Lisensi
MIT