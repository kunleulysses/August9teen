import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../context/GameContext';

export default function InventoryScreen() {
  const { state, actions } = useGame();
  const { player, companion } = state;

  const getItemIcon = (itemId) => {
    const assets = state.assets?.manifest || {};
    return assets.items?.[itemId]?.icon || null;
  };

  const getItemRarity = (itemId) => {
    const rarityMap = {
      apple: 'common',
      ball: 'common',
      bread: 'common',
      water: 'common',
      toy_mouse: 'uncommon',
      feather: 'uncommon',
      magic_acorn: 'rare',
      pearl_of_memory: 'rare',
      star_crystal: 'legendary',
    };
    return rarityMap[itemId] || 'common';
  };

  const getRarityColor = (rarity) => {
    const colorMap = {
      common: '#95A5A6',
      uncommon: '#3498DB',
      rare: '#9B59B6',
      legendary: '#F39C12',
    };
    return colorMap[rarity] || '#95A5A6';
  };

  const handleItemUse = (item) => {
    if (item.type === 'food') {
      if (item.quantity > 0) {
        actions.feedCompanion(item.id);
        actions.showNotification(`Fed ${companion.name} a ${item.name}!`);
      } else {
        actions.showNotification('No more of this item left!');
      }
    } else if (item.type === 'toy') {
      if (item.quantity > 0 && companion.energy > 10) {
        actions.playWithCompanion(item.id);
        actions.showNotification(`${companion.name} played with the ${item.name}!`);
      } else if (companion.energy <= 10) {
        actions.showNotification(`${companion.name} is too tired to play!`);
      } else {
        actions.showNotification('No more of this item left!');
      }
    } else {
      actions.showNotification(`${item.name}: ${item.description || 'A mysterious item...'}`);
    }
  };

  const categorizeItems = () => {
    const categories = {
      food: [],
      toys: [],
      treasures: [],
      other: [],
    };

    player.inventory.forEach(item => {
      if (item.type === 'food') {
        categories.food.push(item);
      } else if (item.type === 'toy') {
        categories.toys.push(item);
      } else if (['rare', 'legendary'].includes(getItemRarity(item.id))) {
        categories.treasures.push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  };

  const categories = categorizeItems();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Player Stats Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statValue}>🪙 {player.coins}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Items</Text>
            <Text style={styles.statValue}>📦 {player.inventory.length}</Text>
          </View>
        </View>
      </View>

      {/* Food Items */}
      {categories.food.length > 0 && (
        <ItemCategory
          title="Food & Treats"
          icon="🍎"
          items={categories.food}
          onItemPress={handleItemUse}
          getItemEmoji={getItemEmoji}
          getRarityColor={getRarityColor}
          getItemRarity={getItemRarity}
        />
      )}

      {/* Toys */}
      {categories.toys.length > 0 && (
        <ItemCategory
          title="Toys & Games"
          icon="🎾"
          items={categories.toys}
          onItemPress={handleItemUse}
          getItemEmoji={getItemEmoji}
          getRarityColor={getRarityColor}
          getItemRarity={getItemRarity}
        />
      )}

      {/* Treasures */}
      {categories.treasures.length > 0 && (
        <ItemCategory
          title="Rare Treasures"
          icon="💎"
          items={categories.treasures}
          onItemPress={handleItemUse}
          getItemEmoji={getItemEmoji}
          getRarityColor={getRarityColor}
          getItemRarity={getItemRarity}
        />
      )}

      {/* Other Items */}
      {categories.other.length > 0 && (
        <ItemCategory
          title="Other Items"
          icon="📦"
          items={categories.other}
          onItemPress={handleItemUse}
          getItemEmoji={getItemEmoji}
          getRarityColor={getRarityColor}
          getItemRarity={getItemRarity}
        />
      )}

      {/* Empty Inventory Message */}
      {player.inventory.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Empty Inventory</Text>
          <Text style={styles.emptyText}>
            Explore the world to find items for your companion!
          </Text>
        </View>
      )}

      {/* Companion Preferences */}
      <View style={styles.preferencesContainer}>
        <Text style={styles.preferencesTitle}>🐱 {companion.name}'s Preferences</Text>
        <View style={styles.preferencesList}>
          <Text style={styles.preferenceItem}>
            💖 Favorite Food: Apples (Happiness +20)
          </Text>
          <Text style={styles.preferenceItem}>
            🎾 Favorite Toy: Ball (Energy -10, Happiness +15)
          </Text>
          <Text style={styles.preferenceItem}>
            ⭐ Loves: Rare treasures and new discoveries
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ItemCategory({ title, icon, items, onItemPress, getItemEmoji, getRarityColor, getItemRarity }) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>
        {icon} {title}
      </Text>
      <View style={styles.itemsGrid}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={`${item.id}-${index}`}
            style={[
              styles.itemCard,
              { borderColor: getRarityColor(getItemRarity(item.id)) }
            ]}
            onPress={() => onItemPress(item)}
            activeOpacity={0.7}
          >
            {getItemIcon(item.id) ? (
              <Image source={{ uri: getItemIcon(item.id) }} style={{ width: 32, height: 32 }} resizeMode="contain" />
            ) : (
              <Text style={styles.itemEmoji}>?</Text>
            )}
            <Text style={styles.itemName}>{item.name}</Text>
            {item.quantity !== undefined && (
              <View style={[
                styles.quantityBadge,
                { backgroundColor: getRarityColor(getItemRarity(item.id)) }
              ]}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            )}
            <View style={[
              styles.rarityIndicator,
              { backgroundColor: getRarityColor(getItemRarity(item.id)) }
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  categoryContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  quantityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rarityIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  preferencesContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  preferencesList: {
    paddingLeft: 10,
  },
  preferenceItem: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
});
