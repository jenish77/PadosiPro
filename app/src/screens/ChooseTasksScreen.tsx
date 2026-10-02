import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { ArrowLeft, Search, CheckCircle2, X } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { TaskCategory, Task } from '../types';
import { CategoryPill } from '../components/CategoryPill';
import { TaskCard } from '../components/TaskCard';
import { PadosiButton } from '../components/PadosiButton';
import { LoadingView, ErrorView } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

export const ChooseTasksScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { saveTaskSelections, selectedTasks, isLoading, fetchUserStatus } = useAuth();

  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(true);
  const [errorCatalog, setErrorCatalog] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTasks && selectedTasks.length > 0) {
      setSelectedTaskIds(selectedTasks.map((t) => t.id));
    }
  }, [selectedTasks]);

  const fetchTaskCatalog = async () => {
    setLoadingCatalog(true);
    setErrorCatalog('');
    try {
      const response = await apiClient.get('/tasks/categories');
      if (response.data?.success) {
        setCategories(response.data.data);
      }
    } catch (error: any) {
      setErrorCatalog(error.message || 'Failed to load task catalogue');
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchTaskCatalog();
  }, []);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const getAllTasks = (): (Task & { categoryName: string })[] => {
    const allList: (Task & { categoryName: string })[] = [];
    categories.forEach((cat) => {
      cat.tasks.forEach((t) => {
        allList.push({ ...t, categoryName: cat.name });
      });
    });
    return allList;
  };

  const getFilteredTasks = () => {
    let list = getAllTasks();

    if (selectedCategory !== 'All') {
      list = list.filter((t) => t.categoryName.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const allTasksList = getAllTasks();
  const chosenTaskObjects = allTasksList.filter((t) => selectedTaskIds.includes(t.id));

  const handleOpenConfirmModal = () => {
    if (selectedTaskIds.length === 0) return;
    setShowConfirmModal(true);
  };

  const handleFinalSave = async () => {
    try {
      await saveTaskSelections(selectedTaskIds);
      await fetchUserStatus();
      setShowConfirmModal(false);
      navigation.navigate('Home');
    } catch (error: any) {
      setShowConfirmModal(false);
      setErrorCatalog(error.message || 'Failed to save selected tasks');
    }
  };

  if (loadingCatalog) {
    return <LoadingView message="Loading task catalogue..." />;
  }

  if (errorCatalog) {
    return <ErrorView message={errorCatalog} onRetry={fetchTaskCatalog} />;
  }

  const categoryNames = ['All', ...categories.map((c) => c.name)];
  const filteredTasks = getFilteredTasks();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.heading}>What can we help with?</Text>
          <Text style={styles.subheading}>Choose the tasks you'd like us to handle.</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Horizontal Pills */}
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categoryNames.map((catName) => (
              <CategoryPill
                key={catName}
                label={catName}
                selected={selectedCategory === catName}
                onPress={() => setSelectedCategory(catName)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Task Cards List */}
        <ScrollView contentContainerStyle={styles.taskListContent}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No matching tasks found.</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                selected={selectedTaskIds.includes(task.id)}
                onToggle={() => toggleTaskSelection(task.id)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomStickyBar}>
        <Text style={styles.selectedCountText}>
          <Text style={styles.selectedCountBold}>{selectedTaskIds.length}</Text> tasks selected
        </Text>
        <PadosiButton
          title="Confirm selection"
          onPress={handleOpenConfirmModal}
          disabled={selectedTaskIds.length === 0}
          loading={isLoading}
          style={styles.confirmButton}
        />
      </View>

      {/* Confirmation Step Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowConfirmModal(false)}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Confirm your selection</Text>
            <Text style={styles.modalSubtitle}>
              You have selected {chosenTaskObjects.length} tasks for your Lifestyle Manager:
            </Text>

            <ScrollView style={styles.chosenListScroll} nestedScrollEnabled>
              {chosenTaskObjects.map((task) => (
                <View key={task.id} style={styles.chosenTaskItem}>
                  <CheckCircle2 size={18} color={colors.primary} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chosenTaskName}>{task.name}</Text>
                    <Text style={styles.chosenTaskCategory}>{task.categoryName}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalActionButtons}>
              <PadosiButton
                title="Edit selection"
                variant="outline"
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalSecondaryButton}
              />
              <PadosiButton
                title="Confirm & Save"
                onPress={handleFinalSave}
                loading={isLoading}
                style={styles.modalPrimaryButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headingSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 24,
  },
  taskListContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomStickyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedCountText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  selectedCountBold: {
    fontWeight: '800',
    color: colors.primary,
  },
  confirmButton: {
    width: 170,
    height: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  chosenListScroll: {
    maxHeight: 240,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  chosenTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chosenTaskName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chosenTaskCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSecondaryButton: {
    flex: 1,
    marginRight: 10,
    height: 48,
  },
  modalPrimaryButton: {
    flex: 1.2,
    height: 48,
  },
});
