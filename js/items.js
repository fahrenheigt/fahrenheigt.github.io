let allItems = []; // Store all items globally for filtering and searching

// Stat mapping for user-friendly names
const statMapping = {
    "FlatHPPoolMod": "Health",
    "rFlatHPModPerLevel": "Health per level",
    "FlatMPPoolMod": "Mana",
    "rFlatMPModPerLevel": "Mana per level",
    "PercentHPPoolMod": "Health %",
    "PercentMPPoolMod": "Mana %",
    "FlatHPRegenMod":  "Health regen",
    "rFlatHPRegenModPerLevel": "Health regen per level",
    "PercentHPRegenMod": "Health regen %",
    "FlatMPRegenMod": "Mana regen",
    "rFlatMPRegenModPerLevel": "Mana regen per level",
    "PercentMPRegenMod": "Mana regen %",
    "FlatArmorMod": "Armor",
    "rFlatArmorModPerLevel": "Armor per level",
    "PercentArmorMod": "Armor %",
    "FlatArmorPenetrationMod": "Lethality",
    "rFlatArmorPenetrationModPerLevel": "Lethality per level",
    "rPercentArmorPenetrationMod": "Armor penetration %",
    "rPercentArmorPenetrationModPerLevel": "Armor penetration % per level",
    "FlatPhysicalDamageMod": "Attack damage",
    "rFlatPhysicalDamageModPerLevel": "Attack damage per level",
    "PercentPhysicalDamageMod": "Attack damage %",
    "FlatMagicDamageMod": "Ability power",
    "rFlatMagicDamageModPerLevel": "Ability power per level",
    "PercentMagicDamageMod": "Ability power %",
    "FlatMovementSpeedMod": "Movement speed",
    "rFlatMovementSpeedModPerLevel": "Movement speed per level",
    "PercentMovementSpeedMod": "Movement speed %",
    "rPercentMovementSpeedModPerLevel": "Movement speed % per level",
    "FlatAttackSpeedMod": "Attack speed",
    "PercentAttackSpeedMod": "Attack speed %",
    "rPercentAttackSpeedModPerLevel": "Attack speed % per level",
    "rFlatDodgeMod": "Dodge",
    "rFlatDodgeModPerLevel": "Dodge per level",
    "PercentDodgeMod": "Dodge %",
    "FlatCritChanceMod": "Critical chance",
    "rFlatCritChanceModPerLevel": "Critical chance per level",
    "PercentCritChanceMod": "Critical chance %",
    "FlatCritDamageMod": "Critical damage",
    "rFlatCritDamageModPerLevel": "Critical damage per level",
    "PercentCritDamageMod": "Critical damage %",
    "FlatBlockMod": "Block",
    "PercentBlockMod": "Block %",
    "FlatSpellBlockMod": "Magic resist",
    "rFlatSpellBlockModPerLevel": "Magic resist per level",
    "PercentSpellBlockMod": "Magic resist %",
    "FlatEXPBonus": "Experience",
    "PercentEXPBonus": "Experience %",
    "rPercentCooldownMod": "Cooldown reduction %",
    "rPercentCooldownModPerLevel": "Cooldown reduction % per level",
    "rFlatTimeDeadMod": "Time dead",
    "rFlatTimeDeadModPerLevel": "Time dead per level",
    "rPercentTimeDeadMod": "Time dead %",
    "rPercentTimeDeadModPerLevel": "Time dead % per level",
    "rFlatGoldPer10Mod": "Gold per 10",
    "rFlatMagicPenetrationMod": "Magic Penetration",
    "rFlatMagicPenetrationModPerLevel": "Magic Penetration per level",
    "rPercentMagicPenetrationMod": "Magic Penetration %",
    "rPercentMagicPenetrationModPerLevel": "Magic Penetration % per level",
    "FlatEnergyRegenMod": "Energy regen",
    "rFlatEnergyRegenModPerLevel": "Energy regen per level",
    "FlatEnergyPoolMod": "Energy",
    "rFlatEnergyModPerLevel": "Energy per level",
    "PercentLifeStealMod": "Life steal %",
    "PercentSpellVampMod": "Spell vamp %",
};
 
$(document).ready(async function () {

    // Fetch the JSON file for items
    await fetch('../data/item.json')
        .then(response => response.json()) // Parse the JSON data
        .then(data => {
            allItems = Object.values(data.data); // Store all items globally
            displayItems(allItems); // Display all items by default
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
        });

    // Handle search input
    $('#item-search').on('input', () => {
        applyFilterAndSearch(); // Trigger search and filter on input
    });

    // Handle filter button click
    $('#apply-filter').on('click', () => {
        applyFilterAndSearch(); // Trigger search and filter on filter change
    });

    // Function to display items in the container
    function displayItems(items) {
        const container = document.getElementById('item-container');
        container.innerHTML = ''; // Clear previous content

        if (items.length === 0) {
            container.innerHTML = '<p>No items found.</p>'; // Handle no items case
            return;
        }

        // Loop through each item and create a card
        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('item-card');

            // Generate HTML content for the item
            card.innerHTML = `
            <div class="item-container">
                <div class="item-img-header">
                    <img src="../images/item/${item.image.full}" alt="${item.name}" class="item-image">
                    <h3>${item.name}</h3>
                    <p class="item-cost">${item.gold.total}g</p>
                </div>
                <div class="item-hover-info" style="display: none;">
                    <ul class="item-stats">
                        ${Object.keys(item.stats).map(stat => `
                            <li><strong>${statMapping[stat] || stat}:</strong> ${item.stats[stat]}</li>
                        `).join('')}
                    </ul>
                    <p class="item-description">${item.plaintext}</p>
                </div>
            </div>
            `;

            // Append the card to the container
            container.appendChild(card);

            // Add click event for expanding the item card
            $(card).on("click", function () {
                expandItemCard(card);
            });
        });
    }

    // Function to filter items based on selected statistic
    function filterItemsByStat(items, stat) {
        if (stat === 'All') {
            return items; // Return all items if 'All' is selected
        }
        return items.filter(item => item.stats[stat] && item.stats[stat] !== 0);
    }

    // Function to search items by name
    function searchItemsByName(items, searchTerm) {
        return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Function to apply both filtering by stat and searching by name
    function applyFilterAndSearch() {
        const selectedStat = $('#stat-filter').val(); // Get selected stat from the dropdown
        const searchTerm = $('#item-search').val().trim(); // Get search term from the input

        let filteredItems = filterItemsByStat(allItems, selectedStat); // Filter by stat
        if (searchTerm) {
            filteredItems = searchItemsByName(filteredItems, searchTerm); // Filter by search term
        }

        displayItems(filteredItems); // Display filtered and/or searched items
    }

    // Function to expand the item card (cloning)
    function expandItemCard(card) {
        var clone;
        clone = $(card).clone();
        $(clone).addClass('item-card-clone');

        $(".item-card-clone").remove();
        $(".item-card").removeClass("blackface");

        $(clone)
            .css("z-index", 1000)
            .css("top", $(card).position().top)
            .css("left", $(card).position().left);

        $("#item-container").append(clone);

        $(card).addClass("blackface");

        $(clone)
            .css("position", "absolute")
            .animate(
                {
                    height: '28rem',
                    width: '16rem',
                },
                {
                    step: function (now, fx) {
                        $(clone).css('transform', "translateX(-1.7rem)");
                    },
                    done: function () {
                        $(clone).children().children(".item-hover-info").show();
                    },
                    duration: 200
                },
                200
            );

        $(clone).on("click", function () {
            $(clone).animate(
                {
                    height: '18rem',
                    width: '12rem',
                },
                {
                    step: function (now, fx) {
                        $(clone).css('transform', "translateX(0)");
                    },
                    done: function () {
                        $(clone).remove();
                        $(card).removeClass("blackface");
                    },
                    duration: 200
                },
                200
            );
        });
    }
});
