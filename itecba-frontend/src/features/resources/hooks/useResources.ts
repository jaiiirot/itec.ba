import { useQuery } from '@tanstack/react-query';
import { resourcesService } from '../services/resourcesService';

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesService.getApprovedResources(), // Llama a la función que ya usabas
  });
};