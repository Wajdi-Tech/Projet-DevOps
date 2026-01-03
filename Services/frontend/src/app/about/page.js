// pages/about.js

import Navbar from "@/components/Navbar"
import Head from 'next/head'

const About = () => {
  return (
    <div>
        <Navbar/>
      <Head>
        <title>À propos de nous - [Nom de votre site]</title>
        <meta name="description" content="Découvrez notre entreprise, notre mission et notre technologie." />
      </Head>

      <section className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">À propos de nous</h1>
        <p className="text-lg mb-6">
          Bienvenue sur <span className="font-bold">[Nom de votre site]</span>, votre destination de confiance pour les électroniques de qualité ! 
          Nous nous engageons à vous fournir les derniers gadgets, appareils et accessoires technologiques, conçus pour améliorer votre quotidien. 
          Notre mission est de rendre votre expérience d'achat fluide, efficace et agréable.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Notre vision</h2>
        <p className="text-lg mb-6">
          Chez <span className="font-bold">[Nom de votre site]</span>, nous croyons que la technologie doit être accessible, fiable et abordable. 
          Notre objectif est de vous offrir une large gamme d’électroniques répondant à tous vos besoins, que ce soit pour le travail, le divertissement ou l'innovation. 
          Nous sommes déterminés à offrir à nos clients les meilleurs produits accompagnés d'un service exceptionnel.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Notre technologie</h2>
        <p className="text-lg mb-6">
          Pour vous offrir la meilleure expérience d'achat en ligne, nous exploitons des technologies de pointe et une infrastructure moderne et évolutive. 
          Notre plateforme est construite selon une <span className="font-bold">architecture microservices</span>, permettant une meilleure évolutivité, flexibilité et réactivité. 
          Grâce à nos pratiques <span className="font-bold">DevOps</span>, nous assurons un déploiement continu de fonctionnalités et de mises à jour pour garder votre expérience d'achat sécurisée et à jour.
        </p>
        <ul className="list-disc pl-6 text-lg mb-6">
          <li><strong>Microservices</strong> : Pour une intégration fluide des fonctionnalités, chaque service fonctionne indépendamment.</li>
          <li><strong>DevOps</strong> : Pour automatiser les processus et rendre les mises à jour plus fiables et rapides.</li>
          <li><strong>Cloud</strong> : Pour des performances optimales et garantir la sécurité de vos données.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Notre équipe</h2>
        <p className="text-lg mb-6">
          Notre équipe se compose de professionnels passionnés qui sont déterminés à offrir le meilleur de la technologie et du service client. 
          Des ingénieurs logiciels expérimentés aux spécialistes du support client, nous travaillons ensemble pour créer une plateforme d’achat en ligne en laquelle vous pouvez avoir confiance.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Pourquoi nous choisir ?</h2>
        <ul className="list-disc pl-6 text-lg mb-6">
          <li><strong>Large sélection</strong> : Une variété d’électroniques dernière génération.</li>
          <li><strong>Service rapide et fiable</strong> : Avec DevOps, des livraisons rapides et un service client réactif.</li>
          <li><strong>Achat sécurisé</strong> : Technologie de cryptage de pointe pour sécuriser vos transactions.</li>
          <li><strong>Innovation continue</strong> : Nous améliorons constamment la plateforme pour mieux vous servir.</li>
        </ul>

        <p className="text-lg mb-6">
          Merci de choisir <span className="font-bold">[Nom de votre site]</span>—là où la technologie rencontre la commodité.
        </p>
      </section>
    </div>
  )
}

export default About
