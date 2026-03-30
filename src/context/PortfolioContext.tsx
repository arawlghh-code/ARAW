import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface PortfolioContextType {
  works: any[];
  visualNotes: any[];
  services: any[];
  brands: any[];
  settings: any;
  loading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [works, setWorks] = useState<any[]>([]);
  const [visualNotes, setVisualNotes] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const worksQuery = query(collection(db, 'works'), orderBy('sortOrder', 'asc'));
    const notesQuery = query(collection(db, 'visualNotes'), orderBy('sortOrder', 'asc'));
    const servicesQuery = query(collection(db, 'services'), orderBy('sortOrder', 'asc'));
    const brandsQuery = query(collection(db, 'brands'), orderBy('sortOrder', 'asc'));
    const settingsQuery = collection(db, 'settings');

    const unsubWorks = onSnapshot(worksQuery, (snapshot) => {
      const worksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorks(worksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'works');
      setLoading(false);
    });

    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVisualNotes(notesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'visualNotes');
    });

    const unsubServices = onSnapshot(servicesQuery, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(servicesData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'services');
    });

    const unsubBrands = onSnapshot(brandsQuery, (snapshot) => {
      const brandsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBrands(brandsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'brands');
    });

    const unsubSettings = onSnapshot(settingsQuery, (snapshot) => {
      const settingsData: any = {};
      snapshot.docs.forEach(doc => {
        settingsData[doc.id] = doc.data();
      });
      setSettings(settingsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings');
    });

    return () => {
      unsubWorks();
      unsubNotes();
      unsubServices();
      unsubBrands();
      unsubSettings();
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{ works, visualNotes, services, brands, settings, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
