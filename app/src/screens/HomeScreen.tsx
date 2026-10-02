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
  Alert,
  Modal,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  Bell,
  Search,
  User as UserIcon,
  Home as HomeIcon,
  Compass,
  LogOut,
  ChevronRight,
  Star,
  PhoneCall,
  ShieldCheck,
  X,
  Edit2,
  ArrowLeft,
  Clock,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { PadosiButton } from '../components/PadosiButton';
import { EmptyView } from '../components/StateViews';
import { SelectedTask } from '../types';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, selectedTasks, logout, fetchUserStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'Home' | 'Explore' | 'Profile'>('Home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showManagerModal, setShowManagerModal] = useState<boolean>(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<SelectedTask | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    fetchUserStatus();
  }, []);

  // Derive city from user address if available, defaulting to Bengaluru
  const getUserCity = () => {
    if (user?.profile?.address) {
      const addr = user.profile.address.toLowerCase();
      if (addr.includes('surat')) return 'Surat';
      if (addr.includes('mumbai')) return 'Mumbai';
      if (addr.includes('delhi')) return 'Delhi NCR';
      if (addr.includes('pune')) return 'Pune';
      if (addr.includes('ahmedabad')) return 'Ahmedabad';
      if (addr.includes('bengaluru') || addr.includes('bangalore')) return 'Bengaluru';

      const parts = user.profile.address.split(/[\s,]+/);
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1].trim();
        if (lastPart.length >= 3) {
          return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        }
      }
    }
    return 'Bengaluru';
  };

  // Dynamic Time-Based Greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning,';
    if (hour >= 12 && hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const userName = user?.profile?.name ? user.profile.name.split(' ')[0] : 'Member';
  const displayCity = getUserCity();

  // Real-time task search filtering
  const filteredTasks = selectedTasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const currentDateFormatted = '02/10/2026';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Bar Header */}
      <View style={styles.topHeader}>
        <View style={styles.userGreetingContainer}>
          <Text style={styles.greetingSub}>{getTimeBasedGreeting()}</Text>
          <Text style={styles.userNameText}>{userName} 👋</Text>
        </View>

        <View style={styles.topRightActions}>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>{displayCity}</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Bell size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleLogout} activeOpacity={0.7}>
            <LogOut size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      {activeTab === 'Home' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>What do you need help with?</Text>
            <View style={styles.searchBar}>
              <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="AC leaking, cook for weekends..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Lifestyle Manager Banner Card */}
          <View style={styles.managerBannerCard}>
            <View style={styles.managerAvatarContainer}>
              <UserIcon size={28} color={colors.primary} />
            </View>
            <View style={styles.managerInfo}>
              <Text style={styles.managerTitle}>Your Lifestyle Manager</Text>
              <Text style={styles.managerSubtitle}>One person. Every task handled.</Text>
            </View>
            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => setShowManagerModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.viewDetailsText}>View details</Text>
              <ChevronRight size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Selected Tasks Section with Common Top Edit Icon */}
          <View style={styles.selectedHeader}>
            <Text style={styles.sectionTitle}>
              Your selected tasks {searchQuery ? `(${filteredTasks.length})` : ''}
            </Text>
            <View style={styles.selectedHeaderActions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ChooseTasks')}
                style={styles.commonEditIconButton}
                activeOpacity={0.7}
              >
                <Edit2 size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ChooseTasks')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedTasks.length === 0 ? (
            <EmptyView
              title="No tasks selected yet"
              message="Tell us what you'd like your Lifestyle Manager to handle."
              actionTitle="Pick tasks"
              onAction={() => navigation.navigate('ChooseTasks')}
            />
          ) : filteredTasks.length === 0 ? (
            <View style={styles.noSearchMatchContainer}>
              <Text style={styles.noSearchMatchText}>No tasks matching "{searchQuery}"</Text>
              <PadosiButton
                title="Browse all tasks"
                variant="secondary"
                onPress={() => navigation.navigate('ChooseTasks')}
                style={{ marginTop: 10, height: 40 }}
              />
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                variant="home"
                onPressItem={() => setSelectedTaskDetail(task)}
              />
            ))
          )}
        </ScrollView>
      ) : activeTab === 'Profile' ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <UserIcon size={40} color={colors.primary} />
            </View>
            <Text style={styles.profileName}>{user?.profile?.name || 'Member'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>City / Area</Text>
            <Text style={styles.infoValue}>{displayCity}</Text>

            <Text style={styles.infoLabel}>Mobile Number</Text>
            <Text style={styles.infoValue}>{user?.profile?.mobileNumber || 'Not specified'}</Text>

            <Text style={styles.infoLabel}>Address & Area</Text>
            <Text style={styles.infoValue}>{user?.profile?.address || 'Not specified'}</Text>

            {user?.profile?.societyBuilding ? (
              <>
                <Text style={styles.infoLabel}>Society / Building</Text>
                <Text style={styles.infoValue}>{user.profile.societyBuilding}</Text>
              </>
            ) : null}

            {user?.profile?.businessName ? (
              <>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{user.profile.businessName}</Text>
              </>
            ) : null}
          </View>

          <PadosiButton
            title="Log out"
            variant="outline"
            icon={<LogOut size={18} color={colors.error} />}
            onPress={handleLogout}
            style={[styles.modifyButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
        </ScrollView>
      ) : (
        <View style={styles.centerExplore}>
          <Compass size={48} color={colors.primary} />
          <Text style={styles.exploreTitle}>Explore Services</Text>
          <Text style={styles.exploreSub}>Discover premium household assistance options.</Text>
          <PadosiButton
            title="Choose tasks"
            onPress={() => navigation.navigate('ChooseTasks')}
            style={{ marginTop: 16, width: 180 }}
          />
        </View>
      )}

      {/* Bottom Navigation Tabs */}
      {!isKeyboardVisible ? (
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Home')}
            activeOpacity={0.7}
          >
            <HomeIcon
              size={22}
              color={activeTab === 'Home' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Home' ? styles.tabLabelActive : null,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Explore')}
            activeOpacity={0.7}
          >
            <Compass
              size={22}
              color={activeTab === 'Explore' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Explore' ? styles.tabLabelActive : null,
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Profile')}
            activeOpacity={0.7}
          >
            <UserIcon
              size={22}
              color={activeTab === 'Profile' ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Profile' ? styles.tabLabelActive : null,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Lifestyle Manager Details Modal */}
      <Modal visible={showManagerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowManagerModal(false)}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              <View style={styles.managerAvatarLarge}>
                <UserIcon size={44} color={colors.primary} />
              </View>
              <Text style={styles.managerNameModal}>Ramesh Sharma</Text>
              <Text style={styles.managerRoleModal}>Your Dedicated Lifestyle Manager</Text>

              <View style={styles.badgeRow}>
                <View style={styles.ratingBadge}>
                  <Star size={14} color={colors.accentGold} fill={colors.accentGold} />
                  <Text style={styles.ratingText}>4.9 (140+ tasks)</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={14} color={colors.primary} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalSectionTitle}>Services Managed for You:</Text>
              <Text style={styles.modalBodyText}>
                • Home maintenance, AC & plumbing coordination{'\n'}
                • Groceries, medicines & parcel pickups{'\n'}
                • Event planning & doctor appointments{'\n'}
                • Document assistance & bills management
              </Text>

              <View style={styles.contactCardModal}>
                <PhoneCall size={20} color={colors.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.contactTitle}>Direct Concierge Support</Text>
                  <Text style={styles.contactSub}>Available 8:00 AM - 9:00 PM</Text>
                </View>
              </View>
            </View>

            <PadosiButton
              title="Close"
              onPress={() => setShowManagerModal(false)}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>

      {/* Task Details Modal (Matching app.padosipro.com Web UI Spec) */}
      <Modal
        visible={!!selectedTaskDetail}
        animationType="slide"
        onRequestClose={() => setSelectedTaskDetail(null)}
      >
        <SafeAreaView style={styles.detailModalSafeArea}>
          <View style={styles.detailModalHeader}>
            <TouchableOpacity
              style={styles.backLinkButton}
              onPress={() => setSelectedTaskDetail(null)}
              activeOpacity={0.7}
            >
              <ArrowLeft size={18} color={colors.primary} />
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>

          {selectedTaskDetail ? (
            <ScrollView contentContainerStyle={styles.detailModalContent}>
              <Text style={styles.detailCategoryTitle}>
                {selectedTaskDetail.categoryName || 'Home'} & Daily Tasks
              </Text>

              <View style={styles.pendingBadgeRow}>
                <View style={styles.pendingPill}>
                  <Clock size={13} color={colors.primary} style={{ marginRight: 4 }} />
                  <Text style={styles.pendingPillText}>Pending</Text>
                </View>
              </View>

              <Text style={styles.pilotSubtitle}>Pilot LM is handling this for you.</Text>

              <Text style={styles.taskDetailBody}>
                {selectedTaskDetail.name}: {selectedTaskDetail.description}
              </Text>

              <Text style={styles.timestampMeta}>
                Requested {currentDateFormatted} · Updated {currentDateFormatted}
              </Text>

              <View style={styles.activitySection}>
                <Text style={styles.activityHeaderTitle}>Activity</Text>
                <View style={styles.activityTimelineItem}>
                  <View style={styles.greenTimelineDot} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.activityStatusTitle}>Created · Pending</Text>
                    <Text style={styles.activityTimestamp}>{currentDateFormatted}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Beautiful Custom Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContent}>
            <View style={styles.logoutIconContainer}>
              <LogOut size={28} color={colors.error} />
            </View>

            <Text style={styles.logoutModalTitle}>Log Out</Text>
            <Text style={styles.logoutModalSubtitle}>
              Are you sure you want to log out of PadosiPro? You'll need to sign back in to access your profile and tasks.
            </Text>

            <View style={styles.logoutModalButtonRow}>
              <TouchableOpacity
                style={styles.logoutCancelButton}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
                disabled={isLoggingOut}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutConfirmButton}
                onPress={async () => {
                  setIsLoggingOut(true);
                  try {
                    await logout();
                    setShowLogoutModal(false);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                  } catch (e) {
                    setIsLoggingOut(false);
                  }
                }}
                activeOpacity={0.8}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <LogOut size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutConfirmText}>Log Out</Text>
                  </>
                )}
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
  },
  userGreetingContainer: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBadge: {
    backgroundColor: colors.accentGoldLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accentGold,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentGold,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  searchSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  managerBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  managerAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  managerInfo: {
    flex: 1,
  },
  managerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  managerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 2,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonEditIconButton: {
    padding: 6,
    marginRight: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  noSearchMatchContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noSearchMatchText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modifyButton: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
  },
  centerExplore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  exploreTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
  },
  exploreSub: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
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
    paddingBottom: 36,
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    padding: 6,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  managerAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  managerNameModal: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  managerRoleModal: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGoldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentGold,
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  modalBody: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalBodyText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  contactCardModal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  contactSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  detailModalSafeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailModalHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  backLinkText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  detailModalContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  detailCategoryTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  pendingBadgeRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  pendingPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  pilotSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  taskDetailBody: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  timestampMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 32,
  },
  activitySection: {
    marginTop: 10,
  },
  activityHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accentGold,
    marginBottom: 16,
  },
  activityTimelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenTimelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  activityStatusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activityTimestamp: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoutModalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  logoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutModalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  logoutModalButtonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutConfirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
