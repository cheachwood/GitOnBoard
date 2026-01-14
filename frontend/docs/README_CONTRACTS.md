# Configuration du Smart Contract

## Fichier `src/lib/contracts.ts`

Ce fichier centralise :

- L'adresse du contrat déployé
- L'ABI (Application Binary Interface) du contrat JobBoard

## Mise à jour de l'ABI

Après modification du smart contract :

1. Recompile le contrat :

```bash
cd backend
npx hardhat compile
```

2. Copie l'ABI :

```bash
cat artifacts/contracts/JobBoard.sol/JobBoard.json
```

3. Remplace le contenu de `JOB_BOARD_ABI` dans `contracts.ts`

## Mise à jour de l'adresse

Après déploiement du contrat :

1. Copie l'adresse du contrat déployé
2. Mets à jour `VITE_CONTRACT_ADDRESS` dans `.env` :

```
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

3. Redémarre le serveur de dev
